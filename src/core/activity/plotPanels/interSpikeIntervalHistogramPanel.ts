import { ActivityChartGraph } from '../activityChartGraph';
import { SpikeActivity } from '../spikeActivity';
import { SpikeTimesPanel } from './spikeTimesPanel';

export class InterSpikeIntervalHistogramPanel extends SpikeTimesPanel {
  private _state: any = {
    binsize: {
      input: 'tickSlider',
      label: 'bin size',
      ticks: [1, 2, 5, 10, 20, 50],
      value: 5,
      unit: 'ms',
    },
    barmode: 'overlay',
    barnorm: '',
    xaxisType: 'linear',
  };

  constructor(graph: ActivityChartGraph) {
    super(graph, 'InterSpikeIntervalHistogramPanel');
    this.name = 'InterSpikeIntervalHistogramPanel';
    this.icon = 'mdi-chart-bar';
    this.label = 'histogram of inter-spike interval';
    this.layout.barmode = this.state.barmode;
    this.visible = false;
    this.xaxis = 2;
    this.init();
  }

  get state(): any {
    return this._state;
  }

  /**
   * Update data for ISI histogram.
   */
  updateData(activity: SpikeActivity): void {
    // console.log('Update data fir ISI histogram.').
    const isi: number[][] = activity.ISI();
    const x: number[] = [].concat.apply([], isi);
    const start = 0.0;
    const end: number = activity.endtime + 1;
    const size: number = this.state.binsize.value;

    this.data.push({
      activityIdx: activity.idx,
      type: 'histogram',
      source: 'x',
      histfunc: 'count',
      text: 'auto',
      legendgroup: 'spikes' + activity.idx,
      name: 'Histogram of ISI in' + activity.recorder.view.label,
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
   * Update layout label for ISI histogram.
   */
  updateLayoutLabel(): void {
    this.layout.xaxis.type = this.state.xaxisType;
    this.layout.xaxis.title = 'Inter-spike interval [ms]';
  }
}
