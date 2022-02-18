import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeTimesPanelModel } from './spikeTimesPanelModel';

export class CVISIHistogramModel extends SpikeTimesPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.icon = 'mdi-chart-bar';
    this.id = 'CVISIHistogram';
    this.label = 'CV of ISI';
    this.panel.xaxis = 3;
    this.params = [
      {
        input: 'tickSlider',
        label: 'bin size',
        ticks: [0.01, 0.02, 0.05, 0.1, 0.2, 0.5],
        value: 0.05,
      },
    ];
  }

  /**
   * Update data for CV of ISI histogram.
   */
  override updateData(activity: SpikeActivity): void {
    // console.log('Update data for CV_ISI histogram.')
    const start = 0;
    const end = 5;
    const size = this.params[0].value;
    const isi: number[][] = activity.ISI();
    const x: number[] = isi.map(
      (i: number[]) => activity.getStandardDeviation(i) / activity.getAverage(i)
    );

    // console.log('Add histogram data of inter-spike interval')
    this.data.push({
      activityIdx: activity.idx,
      histfunc: 'count',
      hoverinfo: 'y',
      legendgroup: 'spikes' + activity.idx,
      marker: {
        color: activity.recorder.view.color,
        line: {
          color: activity.project.app.darkMode ? '#121212' : 'white',
          width: (end - start) / size > 100 ? 0 : 1,
        },
      },
      name: 'Histogram of CV(ISI) in' + activity.recorder.view.label,
      opacity: 0.6,
      showlegend: false,
      source: 'x+y',
      type: 'histogram',
      visible: this.state.visible,
      x,
      xbins: {
        end,
        size,
        start,
      },
    });
  }

  /**
   * Update layout label for CV_ISI histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = 'CV of ISI';
    this.panel.layout.yaxis.title = 'Count';
  }
}
