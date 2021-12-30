import * as d3 from 'd3';

import { Activity } from '../../activity';
import { ActivityChartPanel } from '../activityChartPanel';
import { ActivityChartPanelModel } from '../activityChartPanelModel';

export class AnalogSignalHistogramModel extends ActivityChartPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.id = 'analogSignalHistogram';
    this.icon = 'mdi-chart-bar';
    this.label = 'analog signals';

    this.panel.xaxis = 2;

    this.params = [
      {
        id: 'bins',
        input: 'tickSlider',
        label: 'number of bins',
        ticks: [1, 5, 10, 20, 50, 100, 200],
        value: 50,
      },
    ];
    this.initActivities();
  }

  /**
   * Initialize histogram panel for analog signal.
   */
  override initActivities(): void {
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

    if (this.state.records.length === 0) {
      return;
    }

    this.state.events.forEach((event: any) => {
      this.updateEventData(event);
    });
  }

  /**
   * Update data for analog signal histogram.
   */
  updateEventData(event: any): void {
    // console.log('Update data for analog signal histogram.');
    const activity: Activity = this.activities[event.activityIdx];

    const x: number[] = activity.events[event.id];
    const start: number = d3.min(x);
    const end: number = d3.max(x) + 1;
    const size: number = (end - start) / this.params[0].value;

    this.data.push({
      activityIdx: event.activityIdx,
      legendgroup: event.value,
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
        color: event.color,
        line: {
          color: activity.project.app.darkMode ? '#121212' : 'white',
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
  override updateLayoutLabel(): void {
    // console.log('Update layout label for analog signal.');
    // Label y-axis if only one record existed.
    this.panel.layout.xaxis.title = 'Time [ms]';
    this.panel.layout.yaxis.title = '';

    const events = this.state.events;
    let xAxisTitle: string = '';
    if (events.length === 1) {
      const recordable: any =
        this.activities[0].recorder.model.config.recordables.find(
          (recordable: any) => recordable.id === events[0].id
        );
      xAxisTitle = this.capitalize(recordable.label);
      if (recordable.unit) {
        xAxisTitle += ` [${recordable.unit}]`;
      }
      this.panel.layout.yaxis.title = xAxisTitle;
    } else if (events.length > 1) {
      if (events.every((event: any) => event.id.includes('ct_'))) {
        xAxisTitle = 'Channel activation';
      } else if (events.every((event: any) => event.id.includes('g_'))) {
        xAxisTitle = 'Conductance [nS]';
      } else if (events.every((event: any) => event.id.includes('I_syn_'))) {
        xAxisTitle = 'Total synaptic current [pA]';
      } else if (
        events.every((event: any) => event.id.includes('weighted_spikes_'))
      ) {
        xAxisTitle = 'Weighted incoming spikes';
      } else {
        xAxisTitle = 'Multiple events';
      }
    }
    this.panel.layout.xaxis.title = xAxisTitle;
  }
}
