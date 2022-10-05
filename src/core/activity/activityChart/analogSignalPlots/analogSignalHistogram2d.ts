import * as d3 from 'd3';

import { ActivityChartPanel } from '../activityChartPanel';
import { AnalogSignalPanelModel } from '../analogSignalPanelModel';
import { NodeRecord } from '../../../node/nodeRecord';

export class AnalogSignalHistogram2d extends AnalogSignalPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.panel.xaxis = 2;
    this.params = [
      {
        id: 'bins',
        input: 'tickSlider',
        label: 'number of bins',
        ticks: [1, 5, 10, 20, 50, 100, 200],
        value: 50,
      },
      {
        id: 'colorScale',
        input: 'select',
        items: [
          'Blackbody',
          'Bluered',
          'Earth',
          'Electric',
          'Greens',
          'Greys',
          'Hot',
          'Jet',
          'Picnic',
          'Portland',
          'RdBu',
          'Viridis',
          'YlGnBu',
          'YlOrRd',
        ],
        label: 'Color scale',
        value: 'Viridis',
      },
    ];
  }

  get colorbar(): any {
    const domain: number[] = this.panel.layout.yaxis.domain;
    return {
      len: domain[1] - domain[0],
      y: (domain[0] + domain[1]) / 2,
    };
  }

  get colorscale(): string {
    return this.params[1].value;
  }

  /**
   * Add data of analog signal for histogram panel.
   *
   * @remarks
   * It requires activity data.
   */
  override async addData(): Promise<boolean> {
    return new Promise(resolve => {
      if (this.state.recordsVisible.length === 0) {
        resolve(false);
        return;
      }

      const records = this.state.recordsVisible.filter(
        (record: NodeRecord) =>
          record.values != null && record.values.length > 0
      );

      // Update value range for histogram.
      records.forEach((record: NodeRecord) => {
        this.updateHistogramRange(record.values);
      });

      // Add record data for histogram.
      records.forEach((record: NodeRecord) => this.addRecordData(record));

      resolve(true);
    });
  }

  /**
   * Update value range for histogram.
   *
   * @remarks
   * It requires activity data.
   */
  updateHistogramRange(values: number[] = []): void {
    this.state.histogram.start = Math.min(
      this.state.histogram.start,
      d3.min(values)
    );
    this.state.histogram.end = Math.max(
      this.state.histogram.end,
      d3.max(values)
    );
  }

  /**
   * Add record data for histogram.
   *
   * @remarks
   * It requires record data.
   */
  addRecordData(record: NodeRecord): void {
    const xbins: any = {
      start: this.state.histogram.start,
      end: this.state.histogram.end,
    };
    xbins.size = (xbins.end - xbins.start) / this.params[0].value;

    const colorbar = this.colorbar;
    colorbar.title = { side: 'right', size: 9, text: 'Count' };

    this.data.push({
      activityIdx: record.activity.idx,
      colorbar: colorbar,
      colorscale: this.colorscale,
      hoverinfo: 'z',
      legendgroup: record.groupId,
      name: '2D Histogram of ' + record.nodeLabel,
      recordId: record.id,
      showlegend: false,
      type: 'histogram2d',
      visible: this.state.visible,
      x: record.values,
      y: record.senders,
      xaxis: 'x' + this.panel.xaxis,
      xbins,
    });
  }

  /**
   * Update layout label for analog signal histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = this.axisTitle;
    this.panel.layout.yaxis.title = 'Neuron';
  }
}
