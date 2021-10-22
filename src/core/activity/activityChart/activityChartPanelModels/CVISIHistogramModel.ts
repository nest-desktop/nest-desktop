import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeTimesPlotModel } from './spikeTimesPlotModel';

export class CVISIHistogramModel extends SpikeTimesPlotModel {
  private _params: any[] = [
    {
      input: 'tickSlider',
      label: 'bin size',
      ticks: [0.01, 0.02, 0.05, 0.1, 0.2, 0.5],
      value: 0.05,
    },
  ];

  constructor(panel: ActivityChartPanel) {
    super(panel);
    this.id = 'CVISIHistogram';
    this.icon = 'mdi-chart-bar';
    this.label = 'CV of ISI';
    this.panel.layout.barmode = 'overlay';
    this.state.barnorm = '';
    this.panel.xaxis = 3;
    this.init();
  }

  get params(): any[] {
    return this._params;
  }

  /**
   * Update data for CV of ISI histogram.
   */
  updateData(activity: SpikeActivity): void {
    // console.log('Update data for CV_ISI histogram.')
    const start = 0;
    const end = 5;
    const size = this._params[0].value;
    const isi: number[][] = activity.ISI();
    const x: number[] = isi.map(
      (i: number[]) => activity.getStandardDeviation(i) / activity.getAverage(i)
    );

    // console.log('Add histogram data of inter-spike interval')
    this.data.push({
      activityIdx: activity.idx,
      type: 'histogram',
      source: 'x',
      histfunc: 'count',
      legendgroup: 'spikes' + activity.idx,
      name: 'Histogram of CV(ISI) in' + activity.recorder.view.label,
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
    });
  }

  /**
   * Update layout label for CV_ISI histogram.
   */
  updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = 'CV of ISI';
  }
}
