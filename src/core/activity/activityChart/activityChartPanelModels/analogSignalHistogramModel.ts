import * as d3 from 'd3';

import { AnalogSignalActivity } from '../../analogSignalActivity';
import { ActivityChartPanel } from '../activityChartPanel';
import { ActivityChartPanelModel } from '../activityChartPanelModel';

export class AnalogSignalHistogramModel extends ActivityChartPanelModel {
  private _params: any[] = [
    {
      id: 'bins',
      input: 'tickSlider',
      label: 'number of bins',
      ticks: [1, 5, 10, 20, 50, 100, 200],
      value: 50,
    },
  ];

  constructor(panel: ActivityChartPanel) {
    super(panel);
    this.id = 'AnalogSignalHistogram';
    this.icon = 'mdi-chart-bar';
    this.label = 'analog signals';
    this.panel.layout.barmode = 'overlay';
    this.panel.xaxis = 2;
    this.init();
  }

  override get params(): any[] {
    return this._params;
  }

  /**
   * Initialize histogram panel for analog signal.
   */
  override init(): void {
    this.data = [];
    this.activities = this.panel.graph.project.analogSignalActivities;
  }

  /**
   * Update histogram panel for analog signal.
   *
   * @remarks
   * It requires activity data.
   */
  override updateData(): void {
    // console.log('Init histogram panel of spike times')
    this.data = [];
    this.panel.xaxis = this.panel.graph.panels.indexOf(this.panel) + 1;
    this.updateStateRecords();

    const records: string[] = [];
    this.activities.forEach((activity: AnalogSignalActivity) => {
      this.state.records[activity.idx].forEach((record: string) => {
        this.updateEventData(activity, record);
        if (!records.includes(record)) {
          records.push(record);
        }
      });
    });

    this.updateLayoutLabel(records);
  }

  /**
   * Update data for analog signal histogram.
   */
  updateEventData(activity: AnalogSignalActivity, record: string): void {
    // console.log('Update data for analog signal histogram.');
    const x: number[] = activity.events[record];
    const start: number = d3.min(x);
    const end: number = d3.max(x) + 1;
    const size: number = (end - start) / this._params[0].value;

    this.data.push({
      activityIdx: activity.idx,
      legendgroup: record + activity.idx,
      type: 'histogram',
      source: 'x',
      histfunc: 'count',
      name: 'Histogram of ' + activity.recorder.view.label,
      hoverinfo: 'y',
      showlegend: false,
      opacity: 0.6,
      xbins: {
        start,
        end,
        size,
      },
      marker: {
        color: activity.recorder.view.color,
        line: {
          color: 'white',
          width: (end - start) / size > 100 ? 0 : 1,
        },
      },
      x,
      xaxis: 'x' + this.panel.xaxis,
    });
  }

  /**
   * Update layout label for analog signal histogram.
   */
  override updateLayoutLabel(records: string[] = []): void {
    // console.log('Update layout label for analog signal histogram.');
    // Label x-axis if only one record existed.
    this.panel.layout.xaxis.title = '';
    if (records.length === 1) {
      const record = records[0];
      const recordable: any =
        this.activities[0].recorder.model.config.recordables.find(
          (recordable: any) => recordable.id === record
        );
      let xAxisTitle: string = this.capitalize(recordable.label);
      if (recordable.unit) {
        xAxisTitle += ` [${recordable.unit}]`;
      }
      this.panel.layout.xaxis.title = xAxisTitle;
    } else if (records.length > 1) {
      if (records.every(rec => rec.includes('ct_'))) {
        this.panel.layout.xaxis.title = 'Channel activation';
      } else if (records.every(rec => rec.includes('g_'))) {
        this.panel.layout.xaxis.title = 'Conductance [nS]';
      } else if (records.every(rec => rec.includes('I_syn_'))) {
        this.panel.layout.xaxis.title = 'Total synaptic current [pA]';
      } else if (records.every(rec => rec.includes('weighted_spikes_'))) {
        this.panel.layout.xaxis.title = 'Weighted incoming spikes';
      } else {
        this.panel.layout.xaxis.title = 'Multiple events';
      }
    }
  }
}
