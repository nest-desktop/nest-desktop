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
    start: 0,
    end: 1000,
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
    const x: number[] = activity.events.times;
    const start: number = this._state.start;
    const end: number = this._state.end;
    const size: number = this._state.binsize.value;

    this.data.push({
      activityIdx: activity.idx,
      type: 'histogram',
      source: 'x',
      histfunc: 'count',
      legendgroup: 'spikes' + activity.idx,
      name: 'Histogram of spike times in' + activity.recorder.view.label,
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
   * Update layout label for spike time histogram.
   */
  updateLayoutLabel(): void {
    this.layout.xaxis.title = 'Time [ms]';
    this.layout.yaxis.title = 'Spike count';
  }

  /**
   * Update state for spike time histogram.
   */
  updateStates(activity: SpikeActivity): void {
    this._state.start = 0;
    this._state.end = activity.endtime + 1;
  }
}
