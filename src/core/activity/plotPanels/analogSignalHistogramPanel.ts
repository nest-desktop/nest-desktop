import { AnalogSignalActivity } from '../analogSignalActivity';
import { ActivityChartGraph } from '../activityChartGraph';
import { ActivityGraphPanel } from './activityGraphPanel';

export class AnalogSignalHistogramPanel extends ActivityGraphPanel {
  private _state: any = {
    bins: 250,
    barmode: 'overlay',
    barnorm: '',
    start: -100,
    end: 0,
  };

  constructor(graph: ActivityChartGraph) {
    super(graph, 'AnalogSignalHistogramPanel');
    this.name = 'AnalogSignalHistogramPanel';
    this.icon = 'mdi-chart-bar';
    this.label = 'histogram of analog signals';
    this.layout.xaxis.title = 'Membrane potential [mV]';
    this.layout.barmode = this.state.barmode;
    this.visible = false;
    this.xaxis = 2;
    this.init();
  }

  get state(): any {
    return this._state;
  }

  init(): void {
    this.activities = this.graph.project.activities.filter(
      (activity: AnalogSignalActivity) => activity.hasAnalogData()
    );
    this.data = [];
  }

  update(): void {
    // console.log('Init histogram panel of spike times')
    this.activities.forEach((activity: AnalogSignalActivity) => {
      const recordables: string[] = Object.keys(activity.events).filter(
        (event: string) => !['times', 'senders'].includes(event)
      );
      recordables.forEach((recordFrom: string) => {
        this.updateAnalogSignalHistogram(activity, recordFrom);
      });
    });
  }

  addAnalogSignalHistogram(
    activity: AnalogSignalActivity,
    recordFrom: string
  ): void {
    // console.log('Init histogram panel of of analog signals')
    this.data.push({
      activityIdx: activity.idx,
      legendgroup: recordFrom + activity.idx,
      type: 'histogram',
      source: 'x',
      histfunc: 'count',
      text: 'auto',
      name: 'Histogram of ' + activity.recorder.view.label,
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
      xaxis: 'x' + this.xaxis,
    });
  }

  updateAnalogSignalHistogram(
    activity: AnalogSignalActivity,
    recordFrom: string
  ): void {
    // console.log('Update histogram panel of analog signals')
    if (!this.data.some((d: any) => d.activityIdx === activity.idx)) {
      this.addAnalogSignalHistogram(activity, recordFrom);
    }
    const data: any = this.data.find(
      (d: any) => d.activityIdx === activity.idx
    );
    const event: number[] = activity.events[recordFrom];
    const start: number = this.state.start;
    const end: number = this.state.end;
    const size: number = (end - start) / this.state.bins;
    data.x = event;
    data.xbins.end = end;
    data.xbins.size = size;
    data.xbins.start = start;
    data.marker.line.width = (end - start) / size > 100 ? 0 : 1;
    data.marker.color = activity.recorder.view.color;
  }
}
