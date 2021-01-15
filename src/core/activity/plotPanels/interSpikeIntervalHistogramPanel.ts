import { ActivityChartGraph } from '../activityChartGraph';
import { SpikeActivity } from '../spikeActivity';
import { SpikeTimesPanel } from './spikeTimesPanel';

export class InterSpikeIntervalHistogramPanel extends SpikeTimesPanel {
  private _state: any = {
    binsize: 1.0,
    barmode: 'overlay',
    barnorm: '',
    xaxisType: 'log',
  };

  constructor(graph: ActivityChartGraph) {
    super(graph, 'InterSpikeIntervalHistogramPanel');
    this.name = 'InterSpikeIntervalHistogramPanel';
    this.icon = 'chart-bar';
    this.label = 'histogram of inter-spike interval';
    this.layout.barmode = this.state.barmode;
    this.layout.xaxis.title = 'Inter-spike interval [ms]';
    this.visible = false;
    this.xaxis = 2;
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

  update(): void {
    // console.log('Init histogram panel of spike times')
    this.activities.forEach((activity: SpikeActivity) => {
      this.updateInterSpikeIntervalHistogram(activity);
    });
    this.layout.xaxis.type = this.state.xaxisType;
  }

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
        size: 0.1,
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

  updateInterSpikeIntervalHistogram(activity: SpikeActivity): void {
    // console.log('Update histogram data of inter-spike interval')
    if (!this.data.some((d: any) => d.activityIdx === activity.idx)) {
      this.addInterSpikeIntervalHistogram(activity);
    }
    const start = 0.0;
    const end = 1000.0;
    const size = 1.0;
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
