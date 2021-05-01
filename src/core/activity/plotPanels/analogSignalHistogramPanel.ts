import * as d3 from 'd3';

import { AnalogSignalActivity } from '../analogSignalActivity';
import { ActivityChartGraph } from '../activityChartGraph';
import { ActivityGraphPanel } from './activityGraphPanel';

export class AnalogSignalHistogramPanel extends ActivityGraphPanel {
  private _state: any = {
    bins: {
      input: 'tickSlider',
      label: 'number of bins',
      ticks: [1, 5, 10, 20, 50, 100, 200],
      value: 50,
    },
    barmode: 'overlay',
    barnorm: '',
    start: 0,
    end: 1,
  };

  constructor(graph: ActivityChartGraph) {
    super(graph, 'AnalogSignalHistogramPanel');
    this.name = 'AnalogSignalHistogramPanel';
    this.icon = 'mdi-chart-bar';
    this.label = 'histogram of analog signals';
    this.layout.barmode = this.state.barmode;
    this.visible = false;
    this.xaxis = 2;
    this.init();
  }

  get state(): any {
    return this._state;
  }

  /**
   * Initialize histogram panel for analog signal.
   */
  init(): void {
    this.activities = this.graph.project.analogSignalActivities;
    this.data = [];
  }

  /**
   * Update histogram panel for analog signal.
   *
   * @remarks
   * It requires activity data.
   */
  update(): void {
    // console.log('Init histogram panel of spike times')
    const records: string[] = [];
    this.activities.forEach((activity: AnalogSignalActivity) => {
      const eventKeys: string[] = Object.keys(activity.events).filter(
        (event: string) => !['times', 'senders'].includes(event)
      );
      eventKeys.forEach((eventKey: string) => {
        this.updateAnalogSignalHistogram(activity, eventKey);
        if (!records.includes(eventKey)) {
          records.push(eventKey);
        }
      });
    });

    // Label x-axis if only one record existed.
    if (records.length === 1) {
      const record = records[0];
      const recordable: any = this.activities[0].recorder.model.config.recordables.find(
        (recordable: any) => recordable.id === record
      );
      let xAxisTitle: string = this.capitalize(recordable.label);
      if (recordable.unit) {
        xAxisTitle += ` [${recordable.unit}]`;
      }
      this.layout.xaxis.title = xAxisTitle;
    } else {
      if (records.every(rec => rec.includes('ct_'))) {
        this.layout.xaxis.title = 'Channel activation';
      } else if (records.every(rec => rec.includes('g_'))) {
        this.layout.xaxis.title = 'Conductance [nS]';
      } else if (records.every(rec => rec.includes('I_syn_'))) {
        this.layout.xaxis.title = 'Total synaptic current [pA]';
      } else if (records.every(rec => rec.includes('weighted_spikes_'))) {
        this.layout.xaxis.title = 'Weighted incoming spikes';
      }
    }
  }

  /**
   * Add empty data of analog signal histogram in plot data.
   */
  addAnalogSignalHistogram(
    activity: AnalogSignalActivity,
    recordFrom: string
  ): void {
    // console.log('Init histogram panel of of analog signals')
    this.data.push({
      activityIdx: activity.idx,
      legendgroup: recordFrom + activity.idx,
      type: 'histogram',
      source: 'x',
      histfunc: 'count',
      text: 'auto',
      name: 'Histogram of ' + activity.recorder.view.label,
      hoverinfo: 'y',
      showlegend: false,
      opacity: 0.6,
      xbins: {
        start: 0,
        end: 1,
        size: 0.1,
      },
      marker: {
        color: 'black',
        line: {
          color: 'white',
          width: 1,
        },
      },
      x: [],
      xaxis: 'x' + this.xaxis,
    });
  }

  /**
   * Update analog signal histogram in plot data.
   */
  updateAnalogSignalHistogram(
    activity: AnalogSignalActivity,
    recordFrom: string
  ): void {
    // console.log('Update histogram panel of analog signals')
    if (!this.data.some((d: any) => d.activityIdx === activity.idx)) {
      this.addAnalogSignalHistogram(activity, recordFrom);
    }
    const data: any = this.data.find(
      (d: any) => d.activityIdx === activity.idx
    );
    const event: number[] = activity.events[recordFrom];
    const start: number = d3.min(event);
    const end: number = d3.max(event) + 1;
    const size: number = (end - start) / this.state.bins.value;
    data.x = event;
    data.xbins.end = end;
    data.xbins.size = size;
    data.xbins.start = start;
    data.marker.line.width = (end - start) / size > 100 ? 0 : 1;
    data.marker.color = activity.recorder.view.color;
  }
}
