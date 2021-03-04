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
    this.layout.xaxis.title = 'CV of ISI';
    this.visible = false;
    this.xaxis = 3;
    this.init();
  }

  get state(): any {
    return this._state;
  }

  init(): void {
    // console.log('Init histogram panel for inter-spike interval');
    this.activities = this.graph.project.activities.filter(
      (activity: SpikeActivity) => activity.hasSpikeData()
    );
    this.data = [];
  }

  /**
   * Update CV panel for spike data.
   *
   * @remarks
   * It requires activity data.
   */
  update(): void {
    // console.log('Init histogram panel of spike times')
    this.activities.forEach((activity: SpikeActivity) => {
      this.updateCVISIHistogram(activity);
    });
  }

  addCVISIHistogram(activity: SpikeActivity): void {
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

  updateCVISIHistogram(activity: SpikeActivity): void {
    // console.log('Update histogram data of inter-spike interval')
    if (!this.data.some((d: any) => d.activityIdx === activity.idx)) {
      this.addCVISIHistogram(activity);
    }
    const data: any = this.data.find(
      (d: any) => d.activityIdx === activity.idx
    );
    const isi: number[][] = activity.ISI();
    data.x = isi.map(
      (i: number[]) => activity.getStandardDeviation(i) / activity.getAverage(i)
    );
    data.xbins.start = 0;
    data.xbins.end = 5;
    data.xbins.size = this._state.binsize.value;
    data.marker.line.width = 1;
    data.marker.color = activity.recorder.view.color;
  }
}
