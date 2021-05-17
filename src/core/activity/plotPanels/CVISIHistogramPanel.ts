import { ActivityChartGraph } from '../activityChartGraph';
import { SpikeActivity } from '../spikeActivity';
import { SpikeTimesPanel } from './spikeTimesPanel';

export class CVISIHistogramPanel extends SpikeTimesPanel {
  private _state: any = {
    binsize: {
      input: 'tickSlider',
      label: 'bin size',
      ticks: [0.01, 0.02, 0.05, 0.1, 0.2, 0.5],
      value: 0.05,
    },
    barmode: 'overlay',
    barnorm: '',
  };

  constructor(graph: ActivityChartGraph) {
    super(graph);
    this.name = 'CVISIHistogramPanel';
    this.icon = 'mdi-chart-bar';
    this.label = 'histogram of CV of ISI';
    this.layout.barmode = this.state.barmode;
    this.visible = false;
    this.xaxis = 3;
    this.init();
  }

  get state(): any {
    return this._state;
  }

  /**
   * Update data for CV of ISI histogram.
   */
  updateData(activity: SpikeActivity): void {
    // console.log('Update data for CV_ISI histogram.')
    const start = 0;
    const end = 5;
    const size = this._state.binsize.value;
    const isi: number[][] = activity.ISI();
    const cv_isi: number[] = isi.map(
      (i: number[]) => activity.getStandardDeviation(i) / activity.getAverage(i)
    );

    // console.log('Add histogram data of inter-spike interval')
    this.data.push({
      activityIdx: activity.idx,
      type: 'histogram',
      source: 'x',
      histfunc: 'count',
      text: 'auto',
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
        color: 'black',
        line: {
          color: activity.recorder.view.color,
          width: (end - start) / size > 100 ? 0 : 1,
        },
      },
      x: cv_isi,
    });
  }

  /**
   * Update layout label for CV_ISI histogram.
   */
  updateLayoutLabel(): void {
    this.layout.xaxis.title = 'CV of ISI';
  }
}
