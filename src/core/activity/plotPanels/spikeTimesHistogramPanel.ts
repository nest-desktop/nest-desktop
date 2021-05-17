import { ActivityChartGraph } from '../activityChartGraph';
import { SpikeActivity } from '../spikeActivity';
import { SpikeTimesPanel } from './spikeTimesPanel';

export class SpikeTimesHistogramPanel extends SpikeTimesPanel {
  private _state: any = {
    binsize: {
      input: 'tickSlider',
      label: 'bin size',
      ticks: [5, 10, 25, 50, 100, 250, 500, 1000],
      value: 25,
      unit: 'ms',
    },
    barmode: 'overlay',
    barnorm: '',
  };

  constructor(graph: ActivityChartGraph) {
    super(graph, 'SpikeTimesHistogramPanel');
    this.name = 'SpikeTimesHistogramPanel';
    this.icon = 'mdi-chart-bar';
    this.label = 'histogram of spike times';
    this.layout.barmode = this.state.barmode;
    // this.visible = false;
    this.init();
  }

  get state(): any {
    return this._state;
  }

  /**
   * Update data for spike time histogram.
   */
  updateData(activity: SpikeActivity): void {
    // console.log('Update data of spike time histogram.');
    const start = 1;
    const end: number = activity.endtime + 1;
    const size: number = this.state.binsize.value;

    this.data.push({
      activityIdx: activity.idx,
      type: 'histogram',
      source: 'x',
      histfunc: 'count',
      text: 'auto',
      legendgroup: 'spikes' + activity.idx,
      name: 'Histogram of spike times in' + activity.recorder.view.label,
      hoverinfo: 'y',
      showlegend: false,
      opacity: 0.6,
      xbins: {
        start: start,
        end: end,
        size: size,
      },
      marker: {
        color: activity.recorder.view.color,
        line: {
          color: 'white',
          width: (end - start) / size > 100 ? 0 : 1,
        },
      },
      x: activity.events.times,
    });
  }

  /**
   * Update layout label for spike time histogram.
   */
  updateLayoutLabel(): void {
    this.layout.xaxis.title = 'Time [ms]';
    this.layout.yaxis.title = 'Spike count';
  }
}
