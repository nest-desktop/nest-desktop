import { Activity } from '../activity';
import { ActivityChartGraph } from '../activityChartGraph';
import { SpikeActivity } from '../spikeActivity';
import { SpikeTimesPanel } from './spikeTimesPanel';


export class SpikeTimesHistogramPanel extends SpikeTimesPanel {
  private _state: any = {
    binsize: 25.0,
    barmode: 'overlay',
    barnorm: '',
  };

  constructor(graph: ActivityChartGraph) {
    super(graph, 'SpikeTimesHistogramPanel');
    this.name = 'SpikeTimesHistogramPanel';
    this.icon = 'chart-bar';
    this.label = 'histogram of spike times';
    this.layout.yaxis.title = 'Spike count';
    this.layout.barmode = this.state.barmode;
    // this.visible = false;
    this.init();
  }

  get state(): any {
    return this._state;
  }

  init(): void {
    // console.log('Init histogram panel for spike times');
    this.activities = this.graph.project.activities.filter((activity: SpikeActivity) => activity.hasSpikeData());
    this.data = [];
  }

  update(): void {
    // console.log('Init histogram panel of spike times')
    this.activities.forEach((activity: SpikeActivity) => {
      this.updateSpikeTimesHistogram(activity);
    });
  }

  addSpikeTimesHistogram(activity: SpikeActivity): void {
    // console.log('Add histogram data of spike times')
    this.data.push({
      activityIdx: activity.idx,
      type: 'histogram',
      source: 'x',
      histfunc: 'count',
      text: 'auto',
      legendgroup: 'spikes' + activity.idx,
      name: 'Histogram of spikes in' + activity.recorder.view.label,
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
        }
      },
      x: [],
    });
  }

  updateSpikeTimesHistogram(activity: SpikeActivity): void {
    // console.log('Update histogram data of spike times')
    if (!this.data.some((d: any) => d.activityIdx === activity.idx)) {
      this.addSpikeTimesHistogram(activity);
    }
    const data: any = this.data.find((d: any) => d.activityIdx === activity.idx);
    const start = 1;
    const end: number = activity.endtime + 1;
    const size: number = this.state.binsize;
    data.x = activity.events.times;
    data.xbins.size = size;
    data.xbins.end = end;
    data.marker.line.width = (end - start) / size > 100 ? 0 : 1;
    data.marker.color = activity.recorder.view.color;
  }

}
