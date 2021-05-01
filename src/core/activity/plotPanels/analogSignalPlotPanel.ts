import { Node } from '../../node/node';
import { ActivityChartGraph } from '../activityChartGraph';
import { ActivityGraphPanel } from './activityGraphPanel';
import { AnalogSignalActivity } from '../analogSignalActivity';

export class AnalogSignalPlotPanel extends ActivityGraphPanel {
  constructor(graph: ActivityChartGraph) {
    super(graph);
    this.icon = 'mdi-chart-line';
    this.name = 'AnalogSignalPlotPanel';
    this.label = 'line of analog signals';
    this.init();
  }

  /**
   * Initialize plot panel for analog signals.
   */
  init(): void {
    this.activities = this.graph.project.analogSignalActivities;
    this.data = [];
  }

  /**
   * Update panel for analog signal.
   *
   * @remarks
   * It requires activity data.
   */
  update(): void {
    const records: string[] = [];
    this.activities.forEach((activity: AnalogSignalActivity) => {
      const eventKeys: string[] = Object.keys(activity.events).filter(
        (event: string) => !['times', 'senders'].includes(event)
      );
      eventKeys.forEach((eventKey: string) => {
        if (eventKey === 'V_m') {
          this.updateSpikeThresholdLine(activity);
        }
        if (!records.includes(eventKey)) {
          records.push(eventKey);
        }
      });
    });

    // Label y-axis if only one record existed.
    if (records.length === 1) {
      const record = records[0];
      const recordable: any = this.activities[0].recorder.model.config.recordables.find(
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
    this.layout.xaxis.title = 'Time [ms]';
  }

  /**
   * Update color traces of analog signal.
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
   * Add spike threshold line for membrane potential.
   */
  addSpikeThresholdLine(activity: AnalogSignalActivity): void {
    const thresholds: number[] = activity.recorder.nodes.map((target: Node) =>
      target.getParameter('V_th')
    );
    const threshold: number = thresholds.length > 0 ? thresholds[0] : -55;
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
        color: 'black',
        dash: 'dot',
        width: 2,
      },
      x: [0.1, activity.endtime],
      y: [threshold, threshold],
    });
  }

  /**
   * Update spike threshold line for membrane potential.
   */
  updateSpikeThresholdLine(activity: AnalogSignalActivity): void {
    if (
      !this.data.some(
        (d: any) => d.activityIdx === activity.idx && d.id === 'threshold'
      )
    ) {
      this.addSpikeThresholdLine(activity);
    }

    const data = this.data.find(
      (d: any) => d.activityIdx === activity.idx && d.id === 'threshold'
    );
    const thresholds: number[] = activity.recorder.nodes.map((target: Node) =>
      target.getParameter('V_th')
    );
    const threshold: number = thresholds.length > 0 ? thresholds[0] : -55;
    data.y = [threshold, threshold];
    data.line.color = activity.recorder.view.color;
  }

  /**
   * Add empty data of single line for analog signal.
   */
  addSingleLine(activity: AnalogSignalActivity, recordFrom: string): void {
    this.data.push({
      activityIdx: activity.idx,
      id: recordFrom,
      legendgroup: recordFrom + activity.idx,
      mode: 'lines',
      type: 'scattergl',
      name: '',
      hoverinfo: 'all',
      showlegend: true,
      visible: true,
      line: {
        color: 'black',
        width: 1.5,
      },
      x: [],
      y: [],
    });
  }

  /**
   * Update single line for analog signal.
   */
  updateSingleLine(activity: AnalogSignalActivity, recordFrom: string): void {
    if (
      !this.data.some(
        (d: any) => d.activityIdx === activity.idx && d.id === recordFrom
      )
    ) {
      this.addSingleLine(activity, recordFrom);
    }

    const data: any = this.data.find(
      (d: any) => d.activityIdx === activity.idx && d.id === recordFrom
    );
    data.x = activity.events.times;
    data.y = activity.events[recordFrom];
    data.name = recordFrom + ' of ' + activity.senders[0];
    data.line.color = activity.recorder.view.color;
  }

  /**
   * Add empty data of multiple lines for analog signals.
   */
  addMultipleLines(activity: AnalogSignalActivity, recordFrom: string): void {
    [...Array(100).keys()].forEach((idx: number) => {
      this.data.push({
        activityIdx: activity.idx,
        legendgroup: recordFrom + activity.idx,
        mode: 'lines',
        type: 'scattergl',
        hoverinfo: 'none',
        name: '',
        opacity: idx === 0 ? 0.5 : 0.3,
        showlegend: idx === 0,
        line: {
          color: 'black',
          width: 1,
        },
        x: [],
        y: [],
      });
    });
  }

  /**
   * Update multiple lines for analog signals.
   */
  updateMultipleLines(
    activity: AnalogSignalActivity,
    recordFrom: string
  ): void {
    if (!activity.events.hasOwnProperty(recordFrom)) {
      return;
    }
    if (
      this.data.filter((d: any) => d.legendgroup === recordFrom + activity.idx)
        .length !== 100
    ) {
      this.addMultipleLines(activity, recordFrom);
    }

    const data: any[] = this.data.filter(
      (d: any) => d.legendgroup === recordFrom + activity.idx
    );
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
      const d: any = data[idx];
      d.x = event.x;
      d.y = event.y;
      d.name = event.name;
      d.line.color = activity.recorder.view.color;
    });
  }

  /**
   * Add empty data of average line for analog signals.
   */
  addAverageLine(activity: AnalogSignalActivity, recordFrom: string): void {
    // white background for average line
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
        width: 8,
        color: 'white',
      },
      x: [],
      y: [],
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
        width: 1.5,
        color: 'black',
      },
      x: [],
      y: [],
    });
  }

  /**
   * Update average line for analog signals.
   */
  updateAverageLine(activity: AnalogSignalActivity, recordFrom: string): void {
    if (
      this.data.filter(
        (d: any) => d.legendgroup === recordFrom + '_avg' + activity.idx
      ).length !== 2
    ) {
      this.addAverageLine(activity, recordFrom);
    }

    const data: any[] = this.data.filter(
      (d: any) => d.legendgroup === recordFrom + '_avg' + activity.idx
    );
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

    data.forEach((d: any) => {
      d.x = x;
      d.y = y;
    });

    data[1].line.color = activity.recorder.view.color;
  }
}
