import { Node } from '../../node/node';
import { AnalogSignalActivity } from '../analogSignalActivity';
import { ActivityChartGraph } from '../activityChartGraph';
import { ActivityGraphPanel } from './activityGraphPanel';


export class AnalogSignalPlotPanel extends ActivityGraphPanel {

  constructor(graph: ActivityChartGraph) {
    super(graph);
    this.name = 'AnalogSignalPlotPanel';
    this.label = 'plot of analog signals';
    this.init();
  }

  init(): void {
    this.activities = this.graph.project.activities.filter((activity: AnalogSignalActivity) => activity.hasAnalogData());
    this.data = [];
  }

  update(): void {
    this.activities.forEach((activity: AnalogSignalActivity) => {
      const recordables: string[] = Object.keys(activity.events)
        .filter((event: string) => !['times', 'senders'].includes(event));
      recordables.forEach((recordFrom: string) => {
        if (recordFrom === 'V_m') {
          this.updateSpikeThresholdLine(activity);
        }
      });
    });

    this.activities.forEach((activity: AnalogSignalActivity) => {
      const recordables: string[] = Object.keys(activity.events)
        .filter((event: string) => !['times', 'senders'].includes(event));
      recordables.forEach((recordFrom: string) => {
        if (activity.nodeIds.length === 1) {
          this.updateSingleLine(activity, recordFrom);
        } else {
          this.updateMultipleLines(activity, recordFrom);
        }
      });
    });

    this.activities.forEach((activity: AnalogSignalActivity) => {
      if (activity.nodeIds.length > 1) {
        const recordables: string[] = Object.keys(activity.events)
          .filter((event: string) => !['times', 'senders'].includes(event));
        recordables.forEach((recordFrom: string) => {
          this.updateAverageLine(activity, recordFrom);
        });
      }
    });
  }

  updateColor(): void {
    this.activities.forEach((activity: AnalogSignalActivity) => {
      const data: any = this.data.find((d: any) => d.activityIdx === activity.idx);
      data.line.color = activity.recorder.view.color;
    });
  }

  addSpikeThresholdLine(activity: AnalogSignalActivity): void {
    const thresholds: number[] = activity.recorder.nodes.map((target: Node) => target.getParameter('V_th'));
    const threshold: number = (thresholds.length > 0) ? thresholds[0] : -55.;
    this.data.push({
      activityIdx: activity.idx,
      id: 'threshold',
      mode: 'lines',
      type: 'scattergl',
      showlegend: true,
      hoverinfo: 'none',
      name: 'Spike threshold',
      opacity: .5,
      visible: 'legendonly',
      line: {
        color: 'black',
        dash: 'dot',
        width: 2,
      },
      x: [0, activity.endtime],
      y: [threshold, threshold],
    });
  }

  updateSpikeThresholdLine(activity: AnalogSignalActivity): void {
    if (!this.data.some((d: any) => d.activityIdx === activity.idx && d.id === 'threshold')) {
      this.addSpikeThresholdLine(activity);
    }

    const data = this.data.find((d: any) => d.activityIdx === activity.idx && d.id === 'threshold');
    const thresholds: number[] = activity.recorder.nodes.map((target: Node) => target.getParameter('V_th'));
    const threshold: number = (thresholds.length > 0) ? thresholds[0] : -55.;
    data.y = [threshold, threshold];
    data.line.color = activity.recorder.view.color;
  }

  addSingleLine(activity: AnalogSignalActivity, recordFrom: string): void {
    this.data.push({
      activityIdx: activity.idx,
      id: recordFrom,
      legendgroup: recordFrom + activity.idx,
      mode: 'lines',
      type: 'scattergl',
      name: '',
      hoverinfo: 'all',
      showlegend: true,
      visible: true,
      line: {
        color: 'black',
        width: 1.5,
      },
      x: [],
      y: [],
    });
  }

  updateSingleLine(activity: AnalogSignalActivity, recordFrom: string): void {
    if (!this.data.some((d: any) => d.activityIdx === activity.idx && d.id === recordFrom)) {
      this.addSingleLine(activity, recordFrom);
    }

    const data: any = this.data.find((d: any) => d.activityIdx === activity.idx && d.id === recordFrom);
    data.x = activity.events.times;
    data.y = activity.events[recordFrom];
    data.name = recordFrom + ' of ' + activity.senders[0];
    data.line.color = activity.recorder.view.color;
  }

  addMultipleLines(activity: AnalogSignalActivity, recordFrom: string): void {
    [...Array(100).keys()].forEach((idx: number) => {
      this.data.push({
        activityIdx: activity.idx,
        legendgroup: recordFrom + activity.idx,
        mode: 'lines',
        type: 'scattergl',
        hoverinfo: 'none',
        name: '',
        opacity: idx === 0 ? 0.5 : 0.3,
        showlegend: idx === 0,
        line: {
          color: 'black',
          width: 1,
        },
        x: [],
        y: [],
      });
    });
  }

  updateMultipleLines(activity: AnalogSignalActivity, recordFrom: string): void {
    if (!activity.events.hasOwnProperty(recordFrom)) { return; }
    if (this.data.filter((d: any) => d.legendgroup === recordFrom + activity.idx).length !== 100) {
      this.addMultipleLines(activity, recordFrom);
    }

    const data: any[] = this.data.filter((d: any) => d.legendgroup === recordFrom + activity.idx);
    const senders: number[] = activity.senders.slice(0, 100);
    const events: any[] = senders.map(() => ({ x: [], y: [], name: '' }));

    activity.events.senders.forEach((sender: number, idx: number) => {
      const senderIdx: number = senders.indexOf(sender);
      if (senderIdx === -1) { return; }
      events[senderIdx].x.push(activity.events.times[idx]);
      events[senderIdx].y.push(activity.events[recordFrom][idx]);
      events[senderIdx].name = `${recordFrom} of [${senders[0]} - ${senders[senders.length - 1]}]`;
    });

    events.forEach((event: any, idx: number) => {
      const d: any = data[idx];
      d.x = event.x;
      d.y = event.y;
      d.name = event.name;
      d.line.color = activity.recorder.view.color;
    });


  }

  addAverageLine(activity: AnalogSignalActivity, recordFrom: string): void {
    // white background for average line
    this.data.push({
      activityIdx: activity.idx,
      recordFrom,
      mode: 'lines',
      type: 'scattergl',
      hoverinfo: 'none',
      legendgroup: recordFrom + '_avg' + activity.idx,
      showlegend: false,
      line: {
        width: 8,
        color: 'white'
      },
      x: [],
      y: [],
    });

    // average line
    this.data.push({
      activityIdx: activity.idx,
      recordFrom,
      mode: 'lines',
      type: 'scattergl',
      name: recordFrom + ' average',
      legendgroup: recordFrom + '_avg' + activity.idx,
      hoverinfo: 'all',
      showlegend: true,
      line: {
        width: 1.5,
        color: 'black',
      },
      x: [],
      y: [],
    });
  }

  updateAverageLine(activity: AnalogSignalActivity, recordFrom: string): void {
    if (this.data.filter((d: any) => d.legendgroup === recordFrom + '_avg' + activity.idx).length !== 2) {
      this.addAverageLine(activity, recordFrom);
    }

    const data: any[] = this.data.filter((d: any) => d.legendgroup === recordFrom + '_avg' + activity.idx);
    const senders: number[] = activity.senders;
    const events: any[] = senders.map(() => ({ x: [], y: [], name: '' }));

    activity.events.senders.forEach((sender: number, idx: number) => {
      if (!activity.events.hasOwnProperty(recordFrom)) { return; }
      const senderIdx: number = senders.indexOf(sender);
      if (senderIdx === -1) { return; }
      events[senderIdx].x.push(activity.events.times[idx]);
      events[senderIdx].y.push(activity.events[recordFrom][idx]);
      events[senderIdx].name = `${recordFrom} of [${senders[0]} - ${senders[senders.length - 1]}]`;
    });

    const x: any[] = events[0].x;
    const y: any[] = x.map((d: any, i: number) => {
      const yi: any[] = [];
      senders.forEach((sender: number, idx: number) => yi.push(events[idx].y[i]));
      const sum: number = yi.reduce((a: number, b: number) => (a + b));
      const avg: number = sum / senders.length;
      return avg;
    });

    data.forEach((d: any) => {
      d.x = x;
      d.y = y;
    });

    data[1].line.color = activity.recorder.view.color;
  }

}
