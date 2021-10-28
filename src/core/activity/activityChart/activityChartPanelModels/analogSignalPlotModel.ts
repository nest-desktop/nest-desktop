import { Node } from '../../../node/node';
import { ActivityChartPanel } from '../activityChartPanel';
import { ActivityChartPanelModel } from '../activityChartPanelModel';
import { AnalogSignalActivity } from '../../analogSignalActivity';

export class AnalogSignalPlotModel extends ActivityChartPanelModel {
  constructor(panel: ActivityChartPanel) {
    super(panel);
    this.id = 'AnalogSignalPlot';
    this.icon = 'mdi-chart-bell-curve-cumulative';
    this.label = 'analog signals';
    this.init();
  }

  /**
   * Initialize trace panel for analog signals.
   */
  override init(): void {
    this.data = [];
    this.activities = this.panel.graph.project.analogSignalActivities;
  }

  /**
   * Update trace panel for analog signals.
   *
   * @remarks
   * It requires activity data.
   */
  override update(): void {
    this.data = [];
    this.updateStateRecords();

    // Update spike threshold for membrane potential
    this.activities.forEach((activity: AnalogSignalActivity) => {
      this.state.records[activity.idx].forEach((record: string) => {
        if (record === 'V_m') {
          this.updateSpikeThresholdLine(activity);
        }
      });
    });

    const records: string[] = [];
    // Update single line or multiple lines.
    this.activities.forEach((activity: AnalogSignalActivity) => {
      this.state.records[activity.idx].forEach((record: string) => {
        if (activity.nodeIds.length === 1) {
          this.updateSingleLine(activity, record);
        } else if (activity.nodeIds.length > 1) {
          this.updateMultipleLines(activity, record);
        }
        if (!records.includes(record)) {
          records.push(record);
        }
      });
    });

    // Update average line for recorded population.
    this.activities.forEach((activity: AnalogSignalActivity) => {
      if (activity.nodeIds.length > 1) {
        this.state.records[activity.idx].forEach((record: string) => {
          this.updateAverageLine(activity, record);
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
  updateSingleLine(activity: AnalogSignalActivity, record: string): void {
    if (
      !activity.events.hasOwnProperty(record) ||
      activity.nodeIds.length === 0
    ) {
      return;
    }
    this.data.push({
      activityIdx: activity.idx,
      id: record,
      legendgroup: record + activity.idx,
      mode: 'lines',
      type: 'scattergl',
      name: record + ' of ' + activity.nodeIds[0],
      hoverinfo: 'all',
      showlegend: true,
      visible: true,
      line: {
        color: activity.recorder.view.color,
        width: 1.5,
      },
      x: activity.events.times,
      y: activity.events[record],
    });
  }

  /**
   * Update multiple lines data for analog signals.
   */
  updateMultipleLines(activity: AnalogSignalActivity, record: string): void {
    if (!activity.events.hasOwnProperty(record) ||
      activity.nodeIds.length === 0
    ) {
      return;
    }

    const nodeIds: number[] = activity.nodeIds.slice(0, 100);
    const events: any[] = nodeIds.map(() => ({ x: [], y: [], name: '' }));
    activity.events.senders.forEach((sender: number, idx: number) => {
      const senderIdx: number = nodeIds.indexOf(sender);
      if (senderIdx === -1) {
        return;
      }
      events[senderIdx].x.push(activity.events.times[idx]);
      events[senderIdx].y.push(activity.events[record][idx]);
      events[senderIdx].name = `${record} of [${nodeIds[0]} - ${
        nodeIds[nodeIds.length - 1]
      }]`;
    });

    events.forEach((event: any, idx: number) => {
      this.data.push({
        activityIdx: activity.idx,
        legendgroup: record + activity.idx,
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
  updateAverageLine(activity: AnalogSignalActivity, record: string): void {
    if (
      !activity.events.hasOwnProperty(record) ||
      activity.nodeIds.length === 0
    ) {
      return;
    }

    const nodeIds: number[] = activity.nodeIds;
    const events: any[] = nodeIds.map(() => ({ x: [], y: [], name: '' }));
    activity.events.senders.forEach((sender: number, idx: number) => {
      if (!activity.events.hasOwnProperty(record)) {
        return;
      }
      const senderIdx: number = nodeIds.indexOf(sender);
      if (senderIdx === -1) {
        return;
      }
      events[senderIdx].x.push(activity.events.times[idx]);
      events[senderIdx].y.push(activity.events[record][idx]);
      events[senderIdx].name = `${record} of [${nodeIds[0]} - ${
        nodeIds[nodeIds.length - 1]
      }]`;
    });

    const x: any[] = events[0].x;
    const y: any[] = x.map((_: any, i: number) => {
      const yi: any[] = [];
      nodeIds.forEach((_: number, idx: number) => yi.push(events[idx].y[i]));
      const sum: number = yi.reduce((a: number, b: number) => a + b);
      const avg: number = sum / nodeIds.length;
      return avg;
    });

    this.data.push({
      activityIdx: activity.idx,
      class: 'background',
      record,
      mode: 'lines',
      type: 'scattergl',
      hoverinfo: 'none',
      legendgroup: record + '_avg' + activity.idx,
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
      record,
      mode: 'lines',
      type: 'scattergl',
      name: record + ' average',
      legendgroup: record + '_avg' + activity.idx,
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
  override updateColor(): void {
    this.activities.forEach((activity: AnalogSignalActivity) => {
      const data: any = this.data.filter(
        (d: any) => d.activityIdx === activity.idx && d.class !== 'background'
      );
      if (data.length === 0) {
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
  override updateLayoutLabel(records: string[]): void {
    // console.log('Update layout label for analog signal.');
    // Label y-axis if only one record existed.
    this.panel.layout.xaxis.title = 'Time [ms]';
    this.panel.layout.yaxis.title = '';
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
      this.panel.layout.yaxis.title = yAxisTitle;
    } else if (records.length > 1) {
      if (records.every(rec => rec.includes('ct_'))) {
        this.panel.layout.yaxis.title = 'Channel activation';
      } else if (records.every(rec => rec.includes('g_'))) {
        this.panel.layout.yaxis.title = 'Conductance [nS]';
      } else if (records.every(rec => rec.includes('I_syn_'))) {
        this.panel.layout.yaxis.title = 'Total synaptic current [pA]';
      } else if (records.every(rec => rec.includes('weighted_spikes_'))) {
        this.panel.layout.yaxis.title = 'Weighted incoming spikes';
      } else {
        this.panel.layout.yaxis.title = 'Multiple events';
      }
    }
  }
}
