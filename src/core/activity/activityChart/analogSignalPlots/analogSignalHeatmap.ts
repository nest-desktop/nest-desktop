import { ActivityChartPanel } from '../activityChartPanel';
import { AnalogSignalPanelModel } from '../analogSignalPanelModel';
import { NodeRecord } from '../../../node/nodeRecord';

export class AnalogSignalHeatmap extends AnalogSignalPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.panel.xaxis = 1;

    this.params = [
      {
        id: 'displayedLines',
        input: 'rangeSlider',
        label: 'displayed lines',
        value: [0, 10],
        min: 0,
        max: 100,
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
   * Update panel model for analog signals.
   *
   * @remarks
   * It requires record data.
   */
  override async update(): Promise<boolean> {
    this.data = [];
    return new Promise(resolve => {
      if (this.state.recordsVisible.length === 0) {
        resolve(false);
        return;
      }

      this.updateAnalogRecords();
      this.updateTime();

      const dataAddings = this.state.recordsVisible.map((record: NodeRecord) =>
        this.addData(record)
      );

      Promise.all(dataAddings).then(() => {
        this.updateLayoutLabel();
        resolve(true);
      });
    });
  }

  /**
   * Add data of analog signal for line panel.
   *
   * @remarks
   * It requires record data.
   */
  override async addData(record: NodeRecord): Promise<boolean> {
    return new Promise(resolve => {
      this.addHeatmap(record);
      resolve(true);
    });
  }

  /**
   * Creates the graph data points from a list of node IDs and the recorded
   * data of a node.
   * @param nodeIds Array of node IDs
   * @param record Array of NodeRecords (containing the events)
   * @returns Array containing values
   */
  createGraphDataPoints(nodeIds: number[], record: NodeRecord): number[][] {
    const data: number[][] = nodeIds.map(() => []);

    let senders: number[];
    if (record.activity.events.hasOwnProperty('ports')) {
      senders = record.activity.events.ports;
    } else {
      senders = record.activity.events.senders;
    }

    senders.forEach((sender: number, idx: number) => {
      const senderIdx: number = nodeIds.indexOf(sender);
      if (senderIdx === -1) {
        return;
      }
      data[senderIdx].push(record.values[idx]);
    });
    return data;
  }

  uniqueValues(values: number[]): number[] {
    const onlyUnique = (value: number, index: number, self: number[]) =>
      self.indexOf(value) === index;
    return values.filter(onlyUnique);
  }

  /**
   * Add heatmap data for analog signals.
   */
  addHeatmap(record: NodeRecord): void {
    if (!record.hasEvent) {
      return;
    }

    const nodeIds: number[] = record.activity.nodeIds.slice(
      ...this.params[0].value
    );
    const data: number[][] = this.createGraphDataPoints(nodeIds, record);
    const times = this.uniqueValues(record.times);

    const colorbar = this.colorbar;
    colorbar.title = { side: 'right', size: 9, text: this.axisTitle };

    this.data.push({
      activityIdx: record.activity.idx,
      colorbar: colorbar,
      colorscale: this.colorscale,
      hoverinfo: 'z',
      recordId: record.id,
      type: 'heatmap',
      visible: this.state.visible,
      x: times,
      y: nodeIds,
      z: data,
    });
  }

  /**
   * Update layout label for analog signals.
   */
  override updateLayoutLabel(): void {
    // Label y-axis if only one record existed.
    this.panel.layout.xaxis.title = 'Time [ms]';
    this.panel.layout.yaxis.title = 'Neuron';
  }
}
