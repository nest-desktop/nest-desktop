import { Activity } from '../../activity';
import { ActivityChartPanel } from '../activityChartPanel';
import { ActivityChartPanelModel } from '../activityChartPanelModel';
import { AnalogSignalActivity } from '../../analogSignalActivity';
import { Node } from '../../../node/node';

export class AnalogSignalPlotModel extends ActivityChartPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.id = 'analogSignalPlot';
    this.icon = 'mdi-chart-bell-curve-cumulative';
    this.label = 'analog signals';
    this.initActivities();
  }

  /**
   * Initialize trace panel for analog signals.
   */
  override initActivities(): void {
    this.activities = this.panel.graph.project.analogSignalActivities;
  }

  /**
   * Update trace panel for analog signals.
   *
   * @remarks
   * It requires activity data.
   */
  override update(): void {
    this.updateTime();

    this.data = [];
    if (this.state.records.length === 0) {
      return;
    }

    this.updateAnalogRecords();

    // Update spike threshold for membrane potential
    this.state.events.forEach((event: any) => {
      if (event.id === 'V_m') {
        this.updateSpikeThresholdLine(event);
      }
    });

    // Update single line or multiple lines.
    this.state.events.forEach((event: any) => {
      if (event.nodeSize > 0) {
        event.nodeSize > 1
          ? this.updateMultipleLines(event)
          : this.updateSingleLine(event);
      }
    });

    // Update average line for recorded population.
    this.state.events.forEach((event: any) => {
      if (event.nodeSize > 1) {
        this.updateAverageLine(event);
      }
    });

    this.updateLayoutLabel();
  }

  /**
   * Update spike threshold data for membrane potential.
   */
  updateSpikeThresholdLine(event: any): void {
    const activity: Activity = this.activities[event.activityIdx];

    const thresholds: number[] = activity.recorder.nodes
      .filter((node: Node) => node.modelId.startsWith('iaf'))
      .map((target: Node) => target.getParameter('V_th') || -55);

    if (thresholds.length > 0) {
      this.data.push({
        activityIdx: event.activityIdx,
        id: 'threshold',
        mode: 'lines',
        type: 'scattergl',
        showlegend: true,
        hoverinfo: 'none',
        name: 'Spike threshold',
        opacity: 0.5,
        visible: 'legendonly',
        line: {
          color: event.color,
          dash: 'dot',
          width: 2,
        },
        x: [0.1, activity.currenttime],
        y: [thresholds[0], thresholds[0]],
      });
    }
  }

  /**
   * Update single line data for analog signal.
   */
  updateSingleLine(event: any): void {
    const activity: Activity = this.activities[event.activityIdx];

    if (!activity.events.hasOwnProperty(event.id)) {
      return;
    }

    this.data.push({
      activityIdx: event.activityIdx,
      id: event.id,
      legendgroup: event.value,
      mode: 'lines',
      type: 'scattergl',
      name: event.id + ' of ' + activity.recorder.view.label,
      hoverinfo: 'all',
      showlegend: true,
      visible: true,
      line: {
        color: event.color,
        width: 1.5,
      },
      x: activity.events.times,
      y: activity.events[event.id],
    });
  }

  /**
   * Update multiple lines data for analog signals.
   */
  updateMultipleLines(event: any): void {
    const activity: Activity = this.activities[event.activityIdx];

    if (!activity.events.hasOwnProperty(event.id)) {
      return;
    }

    const nodeIds: number[] = activity.nodeIds.slice(0, 10);
    const data: any[] = nodeIds.map(() => ({ x: [], y: [], name: '' }));
    activity.events.senders.forEach((sender: number, idx: number) => {
      const senderIdx: number = nodeIds.indexOf(sender);
      if (senderIdx === -1) {
        return;
      }
      data[senderIdx].x.push(activity.events.times[idx]);
      data[senderIdx].y.push(activity.events[event.id][idx]);
      data[senderIdx].name = event.id + ' of ' + activity.recorder.view.label;
    });

    data.forEach((d: any, idx: number) => {
      this.data.push({
        activityIdx: event.activityIdx,
      legendgroup: event.value,
        mode: 'lines',
        type: 'scattergl',
        hoverinfo: 'none',
        name: d.name,
        opacity: idx === 0 ? 0.5 : 0.3,
        showlegend: idx === 0,
        line: {
          color: event.color,
          width: 1,
        },
        x: d.x,
        y: d.y,
      });
    });
  }

  /**
   * Update average line for analog signals.
   */
  updateAverageLine(event: any): void {
    const activity: Activity = this.activities[event.activityIdx];
    if (!activity.events.hasOwnProperty(event.id)) {
      return;
    }

    const nodeIds: number[] = activity.nodeIds;
    const data: any[] = nodeIds.map(() => ({ x: [], y: [], name: '' }));
    activity.events.senders.forEach((sender: number, idx: number) => {
      const senderIdx: number = nodeIds.indexOf(sender);
      if (senderIdx === -1) {
        return;
      }
      data[senderIdx].x.push(activity.events.times[idx]);
      data[senderIdx].y.push(activity.events[event.id][idx]);
      data[senderIdx].name = event.id + ' of ' + activity.recorder.view.label;
    });

    const x: any[] = data[0].x;
    const y: any[] = x.map((_: any, i: number) => {
      const yi: any[] = [];
      nodeIds.forEach((_: number, idx: number) => yi.push(data[idx].y[i]));
      const sum: number = yi.reduce((a: number, b: number) => a + b);
      const avg: number = sum / nodeIds.length;
      return avg;
    });

    this.data.push({
      activityIdx: event.activityIdx,
      class: 'background',
      record: event.id,
      mode: 'lines',
      type: 'scattergl',
      hoverinfo: 'none',
      legendgroup: event.value,
      showlegend: false,
      line: {
        color: activity.project.app.darkMode ? '#121212' : 'white',
        width: 4.5,
      },
      x,
      y,
    });

    // average line
    this.data.push({
      activityIdx: activity.idx,
      record: event.id,
      mode: 'lines',
      type: 'scattergl',
      name: event.id + ' average',
      legendgroup: event.value,
      hoverinfo: 'all',
      showlegend: true,
      line: {
        color: event.color,
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
  override updateLayoutLabel(): void {
    // console.log('Update layout label for analog signal.');
    // Label y-axis if only one record existed.
    this.panel.layout.xaxis.title = 'Time [ms]';
    this.panel.layout.yaxis.title = '';

    const events = this.state.events;
    let yAxisTitle: string = '';
    if (events.length === 1) {
      const recordable: any =
        this.activities[0].recorder.model.config.recordables.find(
          (recordable: any) => recordable.id === events[0].id
        );
      yAxisTitle = this.capitalize(recordable.label);
      if (recordable.unit) {
        yAxisTitle += ` [${recordable.unit}]`;
      }
      this.panel.layout.yaxis.title = yAxisTitle;
    } else if (events.length > 1) {
      if (events.every((event:any) => event.id.includes('ct_'))) {
        yAxisTitle = 'Channel activation';
      } else if (events.every((event:any) => event.id.includes('g_'))) {
        yAxisTitle = 'Conductance [nS]';
      } else if (events.every((event:any) => event.id.includes('I_syn_'))) {
        yAxisTitle = 'Total synaptic current [pA]';
      } else if (events.every((event:any) => event.id.includes('weighted_spikes_'))) {
        yAxisTitle = 'Weighted incoming spikes';
      } else {
        yAxisTitle = 'Multiple events';
      }
    }
    this.panel.layout.yaxis.title = yAxisTitle;
  }
}
