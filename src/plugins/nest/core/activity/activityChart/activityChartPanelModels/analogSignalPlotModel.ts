import { darkMode } from "@/helpers/theme";

import { ActivityChartPanel } from "../activityChartPanel";
import { AnalogSignalPanelModel } from "./analogSignalPanelModel";
import { Node } from "../../../node/node";
import { NodeRecord } from "../../../node/nodeRecord";

export class AnalogSignalPlotModel extends AnalogSignalPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.icon = "mdi-chart-bell-curve-cumulative";
    this.id = "analogSignalPlot";
    this.panel.xaxis = 1;

    this.params = [
      {
        id: "displayedLines",
        input: "rangeSlider",
        label: "displayed lines",
        value: [0, 10],
        min: 0,
        max: 100,
      },
      {
        id: "averageLine",
        input: "checkbox",
        label: "average line",
        value: false,
      },
      {
        id: "spikeThreshold",
        input: "checkbox+valueInput",
        label: "spike threshold",
        value: -55,
        visible: false,
      },
    ];

    this.initParams(model.params);
  }

  /**
   * Update panel model for analog signals.
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
      if (record.id === "V_m" && this.params[2].visible) {
        // Add spike threshold for membrane potential.
        this.addSpikeThresholdLine(record);
      }

      if (record.nodeSize === 1) {
        // Add line for a single node.
        this.addSingleLine(record);
      } else if (record.nodeSize > 1) {
        // Add multiple lines for the population.
        this.addMultipleLines(record);

        // Add average line for the population.
        if (this.params[1].value) {
          this.addAverageLine(record);
        }
      }

      // Add active line.
      this.addActiveLine(record);
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
    const data: any[] = nodeIds.map(() => ({ x: [], y: [], name: "" }));

    let senders: number[];
    if ("ports" in record.activity.events) {
      senders = record.activity.events.ports;
    } else {
      senders = record.activity.events.senders;
    }

    senders.forEach((sender: number, idx: number) => {
      const senderIdx: number = nodeIds.indexOf(sender);
      if (senderIdx === -1) {
        return;
      }
      data[senderIdx].x.push(record.times[idx]);
      data[senderIdx].y.push(record.values[idx]);
      data[senderIdx].name = record.id + " of " + record.nodeLabel;
    });
    return data;
  }

  /**
   * Add spike threshold data for membrane potential.
   */
  addSpikeThresholdLine(record: NodeRecord): void {
    const thresholds: number[] = record.node.nodes
      .filter((node: Node) => node.modelId.startsWith("iaf"))
      .map((target: Node) => target.getParameter("V_th").value || -55);

    if (thresholds.length > 0) {
      const line = {
        color: record.color,
        dash: "dot",
        width: 2,
      };

      this.data.push({
        activityIdx: record.activity.idx,
        hoverinfo: "none",
        legendgroup: record.groupId,
        line,
        mode: "lines",
        opacity: 0.5,
        recordId: record.id,
        showlegend: false,
        type: "scattergl",
        visible: this.state.visible,
        x: [0.1, record.activity.currenttime],
        y: [thresholds[0], thresholds[0]], // Gets only first threshold, TODO: find better solution
      });
    }
  }

  /**
   * Add single line data for analog signal.
   */
  addSingleLine(record: NodeRecord): void {
    if (!record.hasEvent) {
      return;
    }

    const line = {
      color: record.color,
      width: 1.5,
    };

    this.data.push({
      activityIdx: record.activity.idx,
      hoverinfo: "x+y",
      legendgroup: record.groupId,
      line,
      mode: "lines",
      name: record.id + " of " + record.nodeLabel,
      recordId: record.id,
      showlegend: true,
      type: "scattergl",
      visible: this.state.visible,
      x: record.times,
      y: record.values,
    });
  }

  /**
   * Add multiple lines data for analog signals.
   */
  addMultipleLines(record: NodeRecord): void {
    if (!record.hasEvent) {
      return;
    }

    const nodeIds: number[] = record.activity.nodeIds.slice(
      ...this.params[0].value
    );
    const data: any[] = this.createGraphDataPoints(nodeIds, record);

    data.forEach((d: any, idx: number) => {
      const line = {
        color: record.color,
        width: 1.5,
      };

      this.data.push({
        activityIdx: record.activity.idx,
        hoverinfo: "none",
        legendgroup: record.groupId,
        line,
        mode: "lines",
        name: d.name,
        nodeId: nodeIds[idx],
        opacity: idx === 0 ? 0.5 : 0.3,
        recordId: record.id,
        showlegend: idx === 0,
        type: "scattergl",
        visible: this.state.visible,
        x: d.x,
        y: d.y,
      });
    });
  }

  /**
   * Add average line for analog signals.
   */
  addAverageLine(record: NodeRecord): void {
    if (!record.hasEvent) {
      return;
    }

    const nodeIds: number[] = record.activity.nodeIds.slice(
      ...this.params[0].value
    );
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
      color: darkMode() ? "#121212" : "white",
      width: 4.5,
    };

    this.data.push({
      activityIdx: record.activity.idx,
      class: "background",
      hoverinfo: "none",
      legendgroup: record.groupId,
      line: bgLine,
      mode: "lines",
      opacity: 0.7,
      recordId: record.id,
      showlegend: false,
      type: "scattergl",
      visible: this.state.visible,
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
      hoverinfo: "x+y",
      legendgroup: record.groupId,
      line,
      mode: "lines",
      recordId: record.id,
      showlegend: false,
      type: "scattergl",
      visible: this.state.visible,
      x,
      y,
    });
  }

  /**
   * Add active line for analog signals.
   *
   * @remarks will be updated in `updateActiveMarker`.
   */
  addActiveLine(record: NodeRecord): void {
    // active line
    this.data.push({
      activityIdx: record.activity.idx,
      hoverinfo: "x+y",
      legendgroup: record.groupId,
      line: {
        color: darkMode() ? "white" : "#121212",
        width: 1.5,
      },
      mode: "lines",
      opacity: 0.5,
      recordId: record.id,
      showlegend: false,
      type: "scattergl",
      visible: false,
      x: [],
      y: [],
    });
  }

  /**
   * Update active marker for analog signals.
   **/
  override updateActiveMarker(record?: NodeRecord): void {
    const plotData = this.data[this.data.length - 1];
    plotData.visible = false;

    // Check if the record is null.
    if (record == null) {
      return;
    }

    // Check if the activity state contains the active node.
    if (record.activity.state.activeNodeId == null) {
      return;
    }

    const nodeIds = this.state.recordsVisible
      .map((record: NodeRecord) => record.activity.nodeIds)
      .flat();

    // Check if the panel displays activity of the active node.
    if (!nodeIds.includes(record.activity.state.activeNodeId)) {
      return;
    }

    const recordIds = this.state.recordsVisible.map(
      (record: NodeRecord) => record.id
    );

    // Check if the record is displayed in the panel.
    if (!recordIds.includes(record.id)) {
      return;
    }

    const data: any = this.createGraphDataPoints(
      [record.activity.state.activeNodeId],
      record
    )[0];

    plotData.x = data.x;
    plotData.y = data.y;
    plotData.line.color = darkMode() ? "white" : "#121212";
    plotData.visible = true;
  }

  /**
   * Update layout label for analog signals.
   */
  override updateLayoutLabel(): void {
    // Label y-axis if only one record existed.
    this.panel.layout.xaxis.title = "Time [ms]";
    this.panel.layout.yaxis.title = this.axisTitle;
  }
}
