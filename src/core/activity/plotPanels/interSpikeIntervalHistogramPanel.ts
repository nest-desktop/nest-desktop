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
   * Initialize histogram panel for inter-spike intervals (ISI).
   */
  init(): void {
    // console.log('Init histogram panel for inter-spike interval');
    this.activities = this.graph.project.spikeActivities;
    this.data = [];
  }

  /**
   * Update histogram panel for inter-spike intervals (ISI).
   *
   * @remarks
   * It requires activity data.
   */
  update(): void {
    // console.log('Init histogram panel of spike times')
    this.activities.forEach((activity: SpikeActivity) => {
      this.updateInterSpikeIntervalHistogram(activity);
    });
    this.layout.xaxis.type = this.state.xaxisType;
    this.layout.xaxis.title = 'Inter-spike interval [ms]';
  }

  /**
   * Add empty data of ISI histogram of spikes.
   */
  addInterSpikeIntervalHistogram(activity: SpikeActivity): void {
    // console.log('Add histogram data of inter-spike interval')
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
        start: 0,
        end: 1,
        size: this._state.binsize.value,
      },
      marker: {
        color: 'black',
        line: {
          color: 'white',
          width: 1,
        },
      },
      x: [],
    });
  }

  /**
   * Update ISI histogram of spikes.
   */
  updateInterSpikeIntervalHistogram(activity: SpikeActivity): void {
    // console.log('Update histogram data of inter-spike interval')
    if (!this.data.some((d: any) => d.activityIdx === activity.idx)) {
      this.addInterSpikeIntervalHistogram(activity);
    }
    const start = 0.0;
    const end: number = activity.endtime + 1;
    const size: number = this.state.binsize.value;
    const data: any = this.data.find(
      (d: any) => d.activityIdx === activity.idx
    );
    const isi: number[][] = activity.ISI();
    data.x = [].concat.apply([], isi);
    data.xbins.start = start;
    data.xbins.size = size;
    data.xbins.end = end;
    data.marker.line.width = (end - start) / size > 100 ? 0 : 1;
    data.marker.color = activity.recorder.view.color;
  }
}
