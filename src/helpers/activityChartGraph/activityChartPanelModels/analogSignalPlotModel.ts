// analogSignalPlotModel.ts

import { TNode } from "@/types";

import { currentBackgroundColor, currentColor } from "../../common/theme";
import { NodeRecord } from "../../node/nodeRecord";
import { ActivityChartPanel, plotType } from "../activityChartPanel";
import { IActivityChartPanelModelData } from "../activityChartPanelModel";
import {
  AnalogSignalPanelModel,
  IAnalogSignalPanelModelProps,
} from "./analogSignalPanelModel";

export interface IAnalogSignalPlotModelProps
  extends IAnalogSignalPanelModelProps {}

interface IDataPoints {
  name: string;
  x: number[];
  y: number[];
}

export class AnalogSignalPlotModel extends AnalogSignalPanelModel {
  constructor(
    panel: ActivityChartPanel,
    modelProps: IAnalogSignalPlotModelProps = {}
  ) {
    super(panel, modelProps);
    this.icon = "mdi:mdi-chart-bell-curve-cumulative";
    this.id = "analogSignalPlot";
    this.panel.xAxis = 1;

    this.params = [
      {
        id: "averageLine",
        component: "checkbox",
        label: "average line",
        value: false,
      },
      {
        id: "spikeThreshold",
        component: "checkbox+valueInput",
        label: "spike threshold",
        value: -55,
        show: false,
      },
    ];

    this.initParams(modelProps.params);
  }

  /**
   * Add active line for analog signals.
   * @param record node record object
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
        color: currentColor(),
        width: 1.5,
      },
      mode: "lines",
      opacity: 0.5,
      recordId: record.id,
      showlegend: false,
      type: plotType,
      visible: false,
      x: [],
      y: [],
    });
  }

  /**
   * Add average line for analog signals.
   * @param record node record object
   */
  addAverageLine(record: NodeRecord): void {
    if (!record.hasEvent || record.activity.state.selected?.length === 0)
      return;

    const nodeIds: number[] = record.activity.state.selected; //record.activity.nodeIds.slice(
    // ...this.params[0].value
    // );
    const data: IDataPoints[] = this.createGraphDataPoints(nodeIds, record);

    const x: number[] = data[0].x;
    const y: number[] = x.map((_: number, i: number) => {
      const yi: number[] = [];
      nodeIds.forEach((_: number, idx: number) => yi.push(data[idx].y[i]));
      const sum: number = yi.reduce((a: number, b: number) => a + b);
      const avg: number = sum / nodeIds.length;
      return avg;
    });

    this.data.push({
      activityIdx: record.activity.idx,
      class: "background",
      hoverinfo: "none",
      legendgroup: record.groupId,
      line: {
        color: currentBackgroundColor(),
        width: 4.5,
      },
      mode: "lines",
      opacity: 0.7,
      recordId: record.id,
      showlegend: false,
      type: plotType,
      visible: this.state.visible,
      x,
      y,
    } as IActivityChartPanelModelData);

    // average line
    this.data.push({
      activityIdx: record.activity.idx,
      hoverinfo: "x+y",
      legendgroup: record.groupId,
      line: {
        color: record.state.color,
        width: 1.5,
      },
      mode: "lines",
      recordId: record.id,
      showlegend: false,
      type: plotType,
      visible: this.state.visible,
      x,
      y,
    } as IActivityChartPanelModelData);
  }

  /**
   * Add multiple lines data for analog signals.
   * @param record node record object
   */
  addMultipleLines(record: NodeRecord): void {
    if (!record.hasEvent || record.activity.state.selected?.length === 0)
      return;

    const nodeIds: number[] = record.activity.nodeIds;
    const selected: number[] = record.activity.state.selected;
    const data: IDataPoints[] = this.createGraphDataPoints(
      nodeIds,
      record,
      selected
    );

    data.forEach((d: IDataPoints, idx: number) => {
      if (selected.includes(nodeIds[idx])) {
        this.data.push({
          activityIdx: record.activity.idx,
          hoverinfo: "x+y",
          legendgroup: record.groupId,
          line: {
            color: record.state.traceColors[idx],
            width: 1.5,
          },
          mode: "lines",
          name: d.name,
          nodeId: nodeIds[idx],
          // opacity: idx === 0 ? 0.5 : 0.3,
          recordId: record.id,
          showlegend: idx === 0,
          type: plotType,
          visible: this.state.visible,
          // yaxis: 'y' + idx,
          x: d.x,
          y: d.y,
          // y: d.y.map(y => y+= 15*idx),
        } as IActivityChartPanelModelData);
      }
    });
  }

  /**
   * Add single line data for analog signal.
   * @param record node record object
   */
  addSingleLine(record: NodeRecord): void {
    if (!record.hasEvent) {
      return;
    }

    this.data.push({
      activityIdx: record.activity.idx,
      hoverinfo: "x+y",
      legendgroup: record.groupId,
      line: {
        color: record.state.color,
        width: 1.5,
      },
      mode: "lines",
      name: record.id + " of " + record.nodeLabel,
      recordId: record.id,
      showlegend: true,
      type: plotType,
      visible: this.state.visible,
      x: record.times,
      y: record.values,
    } as IActivityChartPanelModelData);
  }

  /**
   * Add spike threshold data for membrane potential.
   */
  addSpikeThresholdLine(record: NodeRecord): void {
    record.node.targetNodes
      .filter((node: TNode) => node.modelId.startsWith("iaf"))
      .forEach((node: TNode) => {
        const Vth = node.getParameter("V_th").value as number;

        if (Vth) {
          this.panel.layout.shapes.push({
            label: {
              font: { size: 10 },
              text: "Spike threshold",
              textposition: "end",
            },
            line: {
              color: node.view.color,
              dash: "dot",
              width: 2,
            },
            type: "line",
            x0: 0,
            x1: 1,
            xref: "paper",
            y0: Vth,
            y1: Vth,
            yref: "y",
          });
        }
      });
  }

  /**
   * Creates the graph data points from a list of node IDs and the recorded
   * data of a node.
   * @param nodeIds Array of node IDs
   * @param record Array of NodeRecords (containing the events)
   * @returns Array containing x, y and name value for every data point
   */
  createGraphDataPoints(
    nodeIds: number[],
    record: NodeRecord,
    selected: number[] = []
  ): IDataPoints[] {
    if (!nodeIds || nodeIds.length === 0) return [];
    const data: IDataPoints[] = nodeIds.map(() => ({ name: "", x: [], y: [] }));

    let senders: number[];
    if ("ports" in record.activity.events) {
      senders = record.activity.events.ports;
    } else {
      senders = record.activity.events.senders;
    }

    senders.forEach((sender: number, idx: number) => {
      if (
        (selected.length > 0 && !selected.includes(sender)) ||
        !nodeIds.includes(sender)
      )
        return;

      const senderIdx: number = nodeIds.indexOf(sender);
      data[senderIdx].x.push(record.times[idx]);
      data[senderIdx].y.push(record.values[idx] as number);
      data[senderIdx].name = record.id + " of " + record.nodeLabel;
    });
    return data;
  }

  /**
   * Update panel model for analog signals.
   *
   * @remarks
   * It requires activity data.
   */
  override update(): void {
    this.data = [];

    if (this.recordsVisible.length === 0) return;

    this.updateAnalogRecords();
    this.updateTime();

    this.recordsVisible.forEach((record: NodeRecord) => {
      if (record.id === "V_m") {
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
        if (this.params[0].value as boolean) {
          this.addAverageLine(record);
        }
      }

      // Add active line.
      // this.addActiveLine(record);
    });

    this.updateLayoutLabel();
  }

  /**
   * Update active marker for analog signals.
   * @param record node record object
   */
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

    const nodeIds = this.recordsVisible
      .map((record: NodeRecord) => record.activity.nodeIds)
      .flat();

    // Check if the panel displays activity of the active node.
    if (!nodeIds.includes(record.activity.state.activeNodeId)) {
      return;
    }

    const recordIds = this.recordsVisible.map(
      (record: NodeRecord) => record.id
    );

    // Check if the record is displayed in the panel.
    if (!recordIds.includes(record.id)) {
      return;
    }

    const data: { x: number[]; y: number[] } = this.createGraphDataPoints(
      [record.activity.state.activeNodeId],
      record
    )[0];

    plotData.x = data.x;
    plotData.y = data.y;
    plotData.line.color = currentColor();
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
