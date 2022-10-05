import * as d3 from 'd3';

import { ActivityChartPanel } from '../activityChartPanel';
import { AnalogSignalPanelModel } from '../analogSignalPanelModel';
import { NodeRecord } from '../../../node/nodeRecord';

export class AnalogSignalHistogram extends AnalogSignalPanelModel {
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
    ];
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

    this.data.push({
      activityIdx: record.activity.idx,
      histfunc: 'count',
      hoverinfo: 'x+y',
      legendgroup: record.groupId,
      marker: {
        color: record.color,
        line: {
          color: record.darkMode ? '#121212' : 'white',
          width: this.params[0].value > 100 ? 0 : 1,
        },
      },
      name: 'Histogram of ' + record.nodeLabel,
      opacity: 0.6,
      recordId: record.id,
      showlegend: false,
      source: 'x',
      type: 'histogram',
      visible: this.state.visible,
      x: record.values,
      xaxis: 'x' + this.panel.xaxis,
      xbins,
    });
  }

  /**
   * Update layout label for analog signal histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = this.axisTitle;
    this.panel.layout.yaxis.title = 'Count';
  }
}
