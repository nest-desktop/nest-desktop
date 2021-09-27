import { Node } from '../../node/node';
import { ActivityChartGraph } from '../activityChartGraph';
import { ActivityGraphPanel } from './activityGraphPanel';
import { AnalogSignalActivity } from '../analogSignalActivity';

export class AnalogSignalPlotPanel extends ActivityGraphPanel {
  constructor(graph: ActivityChartGraph) {
    super(graph);
    this.icon = 'mdi-chart-bell-curve-cumulative';
    this.name = 'AnalogSignalPlotPanel';
    this.label = 'line of analog signals';
    this.init();
  }

  /**
   * Initialize trace panel for analog signals.
   */
  init(): void {
    this.data = [];
    this.activities = this.graph.project.analogSignalActivities;
  }

  /**
   * Update trace panel for analog signals.
   *
   * @remarks
   * It requires activity data.
   */
  update(): void {
    this.data = [];
    const records: string[] = [];

    // Update spike threshold for membrane potential
    this.activities.forEach((activity: AnalogSignalActivity) => {
      const recordables: string[] = Object.keys(activity.events).filter(
        (event: string) => !['times', 'senders'].includes(event)
      );
      recordables.forEach((recordFrom: string) => {
        if (recordFrom === 'V_m') {
          this.updateSpikeThresholdLine(activity);
        }
        if (!records.includes(recordFrom)) {
          records.push(recordFrom);
        }
      });
    });

    // Update single line or multiple lines.
    this.activities.forEach((activity: AnalogSignalActivity) => {
      const recordables: string[] = Object.keys(activity.events).filter(
        (event: string) => !['times', 'senders'].includes(event)
      );
      recordables.forEach((recordFrom: string) => {
        if (activity.nodeIds.length === 1) {
          this.updateSingleLine(activity, recordFrom);
        } else {
          this.updateMultipleLines(activity, recordFrom);
        }
      });
    });

    // Update average line for recorded population.
    this.activities.forEach((activity: AnalogSignalActivity) => {
      if (activity.nodeIds.length > 1) {
        const recordables: string[] = Object.keys(activity.events).filter(
          (event: string) => !['times', 'senders'].includes(event)
        );
        recordables.forEach((recordFrom: string) => {
          this.updateAverageLine(activity, recordFrom);
        });
      }
    });

    this.updateLayoutLabel(records);
  }

  /**
   * Update spike threshold data for membrane potential.
   */
  updateSpikeThresholdLine(activity: AnalogSignalActivity): void {
    const thresholds: number[] = activity.recorder.nodes
      .filter((node: Node) => node.modelId.startsWith('iaf'))
      .map((target: Node) => target.getParameter('V_th') || -55);

    if (thresholds.length > 0) {
      this.data.push({
        activityIdx: activity.idx,
        id: 'threshold',
        mode: 'lines',
        type: 'scattergl',
        showlegend: true,
        hoverinfo: 'none',
        name: 'Spike threshold',
        opacity: 0.5,
        visible: 'legendonly',
        line: {
          color: activity.recorder.view.color,
          dash: 'dot',
          width: 2,
        },
        x: [0.1, activity.endtime],
        y: [thresholds[0], thresholds[0]],
      });
    }
  }

  /**
   * Update single line data for analog signal.
   */
  updateSingleLine(activity: AnalogSignalActivity, recordFrom: string): void {
    this.data.push({
      activityIdx: activity.idx,
      id: recordFrom,
      legendgroup: recordFrom + activity.idx,
      mode: 'lines',
      type: 'scattergl',
      name: recordFrom + ' of ' + activity.senders[0],
      hoverinfo: 'all',
      showlegend: true,
      visible: true,
      line: {
        color: activity.recorder.view.color,
        width: 1.5,
      },
      x: activity.events.times,
      y: activity.events[recordFrom],
    });
  }

  /**
   * Update multiple lines data for analog signals.
   */
  updateMultipleLines(
    activity: AnalogSignalActivity,
    recordFrom: string
  ): void {
    if (!activity.events.hasOwnProperty(recordFrom)) {
      return;
    }
    const senders: number[] = activity.senders.slice(0, 100);
    const events: any[] = senders.map(() => ({ x: [], y: [], name: '' }));
    activity.events.senders.forEach((sender: number, idx: number) => {
      const senderIdx: number = senders.indexOf(sender);
      if (senderIdx === -1) {
        return;
      }
      events[senderIdx].x.push(activity.events.times[idx]);
      events[senderIdx].y.push(activity.events[recordFrom][idx]);
      events[senderIdx].name = `${recordFrom} of [${senders[0]} - ${
        senders[senders.length - 1]
      }]`;
    });

    events.forEach((event: any, idx: number) => {
      this.data.push({
        activityIdx: activity.idx,
        legendgroup: recordFrom + activity.idx,
        mode: 'lines',
        type: 'scattergl',
        hoverinfo: 'none',
        name: event.name,
        opacity: idx === 0 ? 0.5 : 0.3,
        showlegend: idx === 0,
        line: {
          color: activity.recorder.view.color,
          width: 1,
        },
        x: event.x,
        y: event.y,
      });
    });
  }

  /**
   * Update average line for analog signals.
   */
  updateAverageLine(activity: AnalogSignalActivity, recordFrom: string): void {
    const senders: number[] = activity.senders;
    const events: any[] = senders.map(() => ({ x: [], y: [], name: '' }));
    activity.events.senders.forEach((sender: number, idx: number) => {
      if (!activity.events.hasOwnProperty(recordFrom)) {
        return;
      }
      const senderIdx: number = senders.indexOf(sender);
      if (senderIdx === -1) {
        return;
      }
      events[senderIdx].x.push(activity.events.times[idx]);
      events[senderIdx].y.push(activity.events[recordFrom][idx]);
      events[senderIdx].name = `${recordFrom} of [${senders[0]} - ${
        senders[senders.length - 1]
      }]`;
    });

    const x: any[] = events[0].x;
    const y: any[] = x.map((_: any, i: number) => {
      const yi: any[] = [];
      senders.forEach((_: number, idx: number) => yi.push(events[idx].y[i]));
      const sum: number = yi.reduce((a: number, b: number) => a + b);
      const avg: number = sum / senders.length;
      return avg;
    });

    this.data.push({
      activityIdx: activity.idx,
      class: 'background',
      recordFrom,
      mode: 'lines',
      type: 'scattergl',
      hoverinfo: 'none',
      legendgroup: recordFrom + '_avg' + activity.idx,
      showlegend: false,
      line: {
        color: 'white',
        width: 4.5,
      },
      x,
      y,
    });

    // average line
    this.data.push({
      activityIdx: activity.idx,
      recordFrom,
      mode: 'lines',
      type: 'scattergl',
      name: recordFrom + ' average',
      legendgroup: recordFrom + '_avg' + activity.idx,
      hoverinfo: 'all',
      showlegend: true,
      line: {
        color: activity.recorder.view.color,
        width: 1.5,
      },
      x,
      y,
    });
  }

  /**
   * Update color traces of analog signals.
   */
  updateColor(): void {
    this.activities.forEach((activity: AnalogSignalActivity) => {
      const data: any = this.data.filter(
        (d: any) => d.activityIdx === activity.idx && d.class !== 'background'
      );
      if (data.length == 0) {
        return;
      }
      data.forEach((d: any) => {
        d.line.color = activity.recorder.view.color;
      });
    });
  }

  /**
   * Update layout label for analog signals.
   */
  updateLayoutLabel(records: string[]): void {
    // console.log('Update layout label for analog signal.');
    // Label y-axis if only one record existed.
    this.layout.xaxis.title = 'Time [ms]';
    if (records.length === 1) {
      const record = records[0];
      const recordable: any =
        this.activities[0].recorder.model.config.recordables.find(
          (recordable: any) => recordable.id === record
        );
      let yAxisTitle: string = this.capitalize(recordable.label);
      if (recordable.unit) {
        yAxisTitle += ` [${recordable.unit}]`;
      }
      this.layout.yaxis.title = yAxisTitle;
    } else {
      if (records.every(rec => rec.includes('ct_'))) {
        this.layout.yaxis.title = 'Channel activation';
      } else if (records.every(rec => rec.includes('g_'))) {
        this.layout.yaxis.title = 'Conductance [nS]';
      } else if (records.every(rec => rec.includes('I_syn_'))) {
        this.layout.yaxis.title = 'Total synaptic current [pA]';
      } else if (records.every(rec => rec.includes('weighted_spikes_'))) {
        this.layout.yaxis.title = 'Weighted incoming spikes';
      }
    }
  }
}
