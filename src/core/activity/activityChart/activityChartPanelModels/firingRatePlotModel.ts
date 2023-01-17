import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeTimesPanelModel } from './spikeTimesPanelModel';
import { Source } from 'three';
import { Node } from '@/core/node/node';
import { sum } from 'mathjs';
import * as d3 from 'd3';

export class FiringRatePlotModel extends SpikeTimesPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.icon = 'mdi-chart-bell-curve-cumulative';
    this.id = 'firingRatePlot';
    this.label = 'Firing rate';
    this.panel.xaxis = 1;
    this.params = [
      {
        id: 'binSize',
        input: 'tickSlider',
        label: 'bin size',
        ticks: [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000],
        unit: 'ms',
        value: 1,
      },
      {
        id: 'normedValue',
        input: 'checkbox',
        label: 'normed value',
        value: false,
      },
    ];

    this.initParams(model.params);
  }

  get binSize(): number {
    return this.params[0].value;
  }

  get normedValue(): boolean {
    return this.params[1].value;
  }

  /**
   * Calculate simple histogram
   * 
   * @param data 
   * @param min 
   * @param max 
   * @param size 
   * @returns histogram
   * 
   * See https://stackoverflow.com/questions/36266895/simple-histogram-algorithm-in-javascript
   */
  histogram(data: number[], min: number = -Infinity, max: number = Infinity, size: number = 1): number[] {
    for (const item of data) {
        if (item < min) min = item;
        else if (item > max) max = item;
    }

    const bins = Math.ceil((max - min + 1) / size);
    const histogram = new Array(bins).fill(0);
    for (const item of data) {
        histogram[Math.floor((item - min) / size )]++;
    }

    return histogram;
}

/**
 * Calculate range
 * @param size number
 * @param startAt number
 * @returns number Array
 */
range(start: number=0, stop:number, step:number = 1): number[] {
  return Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
}



  /**
   * Add data of spike times for histogram panel.
   */
  override addData(activity: SpikeActivity): void {
    if (activity.nodeIds.length === 0) return;

    const nodesLength = sum(activity.recorder.nodes.map((node: Node) => node.size));
    const times: number[] = activity.events.times;
    const start: number = this.state.time.start;
    const end: number = this.state.time.end;
    const size: number = this.binSize;

    const x: number[] = this.range(start, end, size);
    const h: number[] = this.histogram(times, start, end, size);

    let y: number[];
    if (this.normedValue) {
      const hExtent = d3.extent(h);
      y = h.map((val: number) => (val - hExtent[0]) / hExtent[1]);
    } else {
      y = h.map((val: number) => val / nodesLength / size * 1000);
    }

    this.data.push({
      activityIdx: activity.idx,
      hoverinfo: 'x+y',
      legendgroup: 'spikes' + activity.idx,
      line: {
        color: activity.recorder.view.color,
        width: 1.5,
      },
      mode: 'lines',
      showlegend: false,
      type: 'scattergl',
      visible: this.state.visible,
      x,
      y,
    });
  }

  /**
   * Update layout label for spike time histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = 'Time [ms]';
    this.panel.layout.yaxis.title = this.normedValue ? 'Normed' : 'Firing rate [spikes/s]';
  }
}
