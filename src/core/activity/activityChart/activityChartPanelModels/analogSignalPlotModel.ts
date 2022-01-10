import { ActivityChartPanel } from '../activityChartPanel';
import { AnalogSignalPanelModel } from './analogSignalPanelModel';
import { Node } from '../../../node/node';
import { NodeRecord } from '../../../node/nodeRecord';

export class AnalogSignalPlotModel extends AnalogSignalPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.id = 'analogSignalPlot';
    this.icon = 'mdi-chart-bell-curve-cumulative';
    this.panel.xaxis = 1;
  }

  /**
   * Update trace panel for analog signals.
   *
   * @remarks
   * It requires activity data.
   */
  override update(): void {
    this.data = [];
    if (this.state.recordsVisible.length === 0) {
      return;
    }

    this.updateAnalogRecords();
    this.updateTime();

    this.state.recordsVisible.forEach((record: NodeRecord) => {
      if (record.id === 'V_m') {
        // Update spike threshold for membrane potential.
        this.updateSpikeThresholdLine(record);
      }

      if (record.nodeSize === 1) {
        // Update line for a single node.
        this.updateSingleLine(record);
      } else if (record.nodeSize > 1) {
        // Update multiple lines for population.
        this.updateMultipleLines(record);
        // Update average line for population.
        this.updateAverageLine(record);
      }
    });

    this.updateLayoutLabel();
  }

  /**
   * Creates the graph data points from a list of node IDs and the recorded
   * data of a node.
   * @param nodeIds Array of node IDs
   * @param record Array of NodeRecords (containing the events)
   * @returns Array containing x, y and name value for every data point
   */
  createGraphDataPoints(nodeIds: number[], record: NodeRecord): any[] {
    const data: any[] = nodeIds.map(() => ({ x: [], y: [], name: '' }));
    record.activity.events.senders.forEach((sender: number, idx: number) => {
      const senderIdx: number = nodeIds.indexOf(sender);
      if (senderIdx === -1) {
        return;
      }
      data[senderIdx].x.push(record.times[idx]);
      data[senderIdx].y.push(record.values[idx]);
      data[senderIdx].name = record.id + ' of ' + record.nodeLabel;
    });
    return data;
  }

  /**
   * Update spike threshold data for membrane potential.
   */
  updateSpikeThresholdLine(record: NodeRecord): void {
    const thresholds: number[] = record.node.nodes
      .filter((node: Node) => node.modelId.startsWith('iaf'))
      .map((target: Node) => target.getParameter('V_th') || -55);

    if (thresholds.length > 0) {
      const line = {
        color: record.color,
        dash: 'dot',
        width: 2,
      };

      this.data.push({
        activityIdx: record.activity.idx,
        hoverinfo: 'none',
        id: 'threshold',
        line,
        mode: 'lines',
        name: 'Spike threshold',
        opacity: 0.5,
        recordId: record.id,
        showlegend: true,
        type: 'scattergl',
        visible: 'legendonly',
        x: [0.1, record.activity.currenttime],
        y: [thresholds[0], thresholds[0]], // gets only first threshold, TODO: find better solution
      });
    }
  }

  /**
   * Update single line data for analog signal.
   */
  updateSingleLine(record: NodeRecord): void {
    if (!record.hasEvent()) {
      return;
    }

    const line = {
      color: record.color,
      width: 1.5,
    };

    this.data.push({
      activityIdx: record.activity.idx,
      hoverinfo: 'all',
      legendgroup: record.groupId,
      line,
      mode: 'lines',
      name: record.id + ' of ' + record.nodeLabel,
      recordId: record.id,
      showlegend: true,
      type: 'scattergl',
      visible: true,
      x: record.times,
      y: record.values,
    });
  }

  /**
   * Update multiple lines data for analog signals.
   */
  updateMultipleLines(record: NodeRecord): void {
    if (!record.hasEvent()) {
      return;
    }

    const nodeIds: number[] = record.activity.nodeIds.slice(0, 10);
    const data: any[] = this.createGraphDataPoints(nodeIds, record);

    data.forEach((d: any, idx: number) => {
      const line = {
        color: record.color,
        width: 1,
      };

      this.data.push({
        activityIdx: record.activity.idx,
        hoverinfo: 'none',
        legendgroup: record.groupId,
        line,
        mode: 'lines',
        name: d.name,
        opacity: idx === 0 ? 0.5 : 0.3,
        recordId: record.id,
        showlegend: idx === 0,
        type: 'scattergl',
        x: d.x,
        y: d.y,
      });
    });
  }

  /**
   * Update average line for analog signals.
   */
  updateAverageLine(record: NodeRecord): void {
    if (!record.hasEvent()) {
      return;
    }

    const nodeIds: number[] = record.activity.nodeIds;
    const data: any[] = this.createGraphDataPoints(nodeIds, record);

    const x: any[] = data[0].x;
    const y: any[] = x.map((_: any, i: number) => {
      const yi: any[] = [];
      nodeIds.forEach((_: number, idx: number) => yi.push(data[idx].y[i]));
      const sum: number = yi.reduce((a: number, b: number) => a + b);
      const avg: number = sum / nodeIds.length;
      return avg;
    });

    const bgLine = {
      color: record.activity.project.app.darkMode ? '#121212' : 'white',
      width: 4.5,
    };

    this.data.push({
      activityIdx: record.activity.idx,
      class: 'background',
      hoverinfo: 'none',
      legendgroup: record.groupId,
      line: bgLine,
      mode: 'lines',
      recordId: record.id,
      showlegend: false,
      type: 'scattergl',
      x,
      y,
    });

    const line = {
      color: record.color,
      width: 1.5,
    };

    // average line
    this.data.push({
      activityIdx: record.activity.idx,
      hoverinfo: 'all',
      legendgroup: record.groupId,
      line,
      mode: 'lines',
      name: record.groupId + ' average',
      recordId: record.id,
      showlegend: false,
      type: 'scattergl',
      x,
      y,
    });
  }

  /**
   * Update layout label for analog signals.
   */
  override updateLayoutLabel(): void {
    // console.log('Update layout label for analog signal.');
    // Label y-axis if only one record existed.
    this.panel.layout.xaxis.title = 'Time [ms]';
    this.panel.layout.yaxis.title = this.axisTitle;
  }
}
