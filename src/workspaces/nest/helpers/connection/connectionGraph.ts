// NESTConnectionGraph.ts

import { drag, select, transition } from "d3";
import { nextTick } from "vue";

import { ConnectionGraph } from "@/helpers/connectionGraph/connectionGraph";
import { TDragBehavior, TNodeGroup, TSelection } from "@/types";
import { drawPathNode } from "@/helpers/connectionGraph/connectionGraphPath";

import { NESTNetworkGraph } from "../network/networkGraph";
import { NESTNetwork } from "../network/network";
import { NESTCopyModel } from "../model/copyModel";
import { NESTConnection } from "./connection";
import { NESTNode } from "../node/node";

export class NESTConnectionGraph extends ConnectionGraph {
  constructor(networkGraph: NESTNetworkGraph) {
    super(networkGraph);
  }

  get network(): NESTNetwork {
    return this.networkGraph.network as NESTNetwork;
  }

  get networkGraph(): NESTNetworkGraph {
    return this._networkGraph as NESTNetworkGraph;
  }

  /**
   * Drag connection graph by moving its node graphs.
   * @param event mouse event
   * @param connection connection object
   */
  drag(event: MouseEvent, connection: NESTConnection): void {
    if (this.state.dragLine || !connection) return;

    // @ts-expect-error Property 'dx'/'dy' does not exist on type 'MouseEvent'.
    const pos: { x: number; y: number } = { x: event.dx, y: event.dy };

    if (connection.source.isNode) {
      const sourceNodePosition = connection.sourceNode.view.position;
      sourceNodePosition.x += pos.x;
      sourceNodePosition.y += pos.y;
    } else {
      connection.sourceNodeGroup.nodeItemsDeep.forEach((node: NESTNode) => {
        const nodePosition = node.view.position;
        nodePosition.x += pos.x;
        nodePosition.y += pos.y;
      });
    }

    if (connection.target.isNode) {
      const targetNodePosition = connection.target.view.position;
      targetNodePosition.x += pos.x;
      targetNodePosition.y += pos.y;
    } else {
      connection.targetNodeGroup.nodeItemsDeep.forEach((node: NESTNode) => {
        const nodePosition = node.view.position;
        nodePosition.x += pos.x;
        nodePosition.y += pos.y;
      });
    }

    connection.nodeGroups.forEach((nodeGroup: TNodeGroup) => nodeGroup.view.updateCentroid());

    nextTick(() => this._networkGraph.render());
  }

  /**
   * Initialize a connection graph.
   * @param connection connection object
   * @param idx index of the element
   * @param elements SVG elements
   */
  init(connection: NESTConnection, idx: number, elements: SVGGElement[] | ArrayLike<SVGGElement>): void {
    const elem: TSelection = select(elements[idx]);

    elem.selectAll("*").remove();

    elem
      .append("path")
      .style("fill", "none")
      .style("stroke", "black")
      .style("opacity", 0)
      .attr("stroke-linecap", "round")
      .style("stroke-width", 30);

    elem
      .append("path")
      .attr("class", "color")
      .style("fill", "none")
      .style("opacity", 1)
      .attr("stroke-linecap", "round")
      .style("stroke-width", this.strokeWidth)
      .style("pointer-events", "none");

    // elem
    //   .append("text");

    elem
      .on("mouseover", (_, c: NESTConnection) => {
        c.state.focus();

        // Draw line between selected node and focused connection.
        if (c.network.nodes.isWeightRecorderSelected && c.network.connections.state.selectedNode && this.state.dragLine)
          this._networkGraph.workspace.dragline.drawPath(
            c.network.connections.state.selectedNode.view.position,
            c.view.markerEndPosition,
          );

        this._networkGraph.update();
      })
      .on("mouseout", () => {
        this._networkGraph.network.connections.unfocusConnection();
        this._networkGraph.update();
      })
      .on("click", () => {
        const workspace = this._networkGraph.workspace;
        connection.sourceNode.view.focus();

        if (this.network.connections.state.selectedNode && workspace.state.dragLine) {
          // Set cursor position of the focused connection.
          workspace.updateCursorPosition(connection.view.centerPosition);

          // Disable animation in network workspace.
          workspace.animationOff();

          // Get copied synapse model.
          let copyModel = this.network.copyModels.all.find(
            (model: NESTCopyModel) => model.id === connection.synapse.copyModel?.id,
          );

          // Copy synapse model if not existed in the model list.
          if (copyModel === undefined) {
            copyModel = this.network.copyModels.copy(
              connection.synapse.modelId,
              // connection.synapse.toJSON().params,
            );
            connection.synapse.loadModel([
              { id: "weight_recorder", value: this.network.connections.state.selectedNode.view.label },
            ]);
            copyModel.init();
          }

          connection.synapse.modelId = copyModel.id;

          // if (copyModel.hasParameters && copyModel.paramsVisible.includes("weight_recorder")) {
          //   // Assign weight recorder to copied synapse model.
          //   const WeightRecorderParam = copyModel.filteredParams.find(
          //     (param: NESTCopyModelParameter) => param.id === "weight_recorder",
          //   );

          //   if (WeightRecorderParam && this.network.connections.state.selectedNode) {
          //     WeightRecorderParam.value = this.network.connections.state.selectedNode.view.label;
          //   }
          // }

          // Hide all synapse parameters.
          // connection.synapse.hideAllParams();
          // connection.synapse.changes();

          // Update record colors of the weight recorder.
          if (this.network.connections.state.selectedNode.isNode) {
            const selectedNode = this.network.connections.state.selectedNode as NESTNode;
            selectedNode.updateRecordsColor();
          }
        } else {
          connection.state.select();
        }
      })
      .on("contextmenu", (event: MouseEvent, c: NESTConnection) => {
        event.preventDefault();
        this._networkGraph.workspace.reset();

        this._networkGraph.openContextMenu([event.clientX, event.clientY], {
          connection: c as NESTConnection,
        });
      });
  }

  /**
   * Render connection graphs.
   */
  render(): void {
    this.logger.trace("render");

    this.updateStyle();

    const duration: number = this._networkGraph.workspace.state.dragging ? 0 : 250;
    const t = transition().duration(duration);

    const connections = select("g#connections").selectAll("g.connection");
    connections
      .style("color", (c: NESTConnection | any) => {
        if (!c.source) return;
        return "var(--colorNode" + c.sourceIdx + ")";
      })
      .transition(t)
      .style("opacity", 1);

    connections.each((connection: NESTConnection, idx: number, elements: any[]) => {
      if (!connection.source) return;
      const elem: TSelection = select(elements[idx]);

      elem
        .selectAll("path")
        .transition(t)
        .attr(
          "d",
          drawPathNode(
            connection.source.view.position,
            connection.target.view.position,
            connection.view.connectionGraphOptions,
          ),
        );

      elem
        .select("path.color")
        .style("stroke", "currentColor")
        .style("stroke-width", this.strokeWidth * (connection.state.isFocused ? 1.2 : 1))
        .style("opacity", connection.view.opacity ? 1 : 0.3)
        .attr("marker-end", `url(#syn-${connection.idx})`)
        .style("stroke-dasharray", connection.view.probabilistic() ? "7.85" : "");

      elem.transition(t).delay(duration).style("opacity", 1);

      // const pos = connection.view.markerEndPosition;

      this._networkGraph.selector
        ?.selectAll(`#syn-${connection.idx}`)
        .select("text")
        .attr("dx", connection.view.toRight ? 8 : -8)
        .attr("dy", connection.view.toRight ? 3.5 : -4.5)
        .classed("toLeft", !connection.view.toRight)
        .text(connection.synapse.paramsVisible.includes("weight") ? connection.synapse.weight : "");

      // .style("font-family", "Roboto")
      // .style("font-size", "0.7em", "important")
      // .style("font-weight", "900")
      // .style("pointer-events", "none")
      // .style("text-anchor", "middle")
      // .attr("transform", `translate(${pos.x},${pos.y})`);
    });
  }

  /**
   * Update connections in network graph.
   * @remarks This function should be called when connections are changed.
   */
  update(): void {
    if (!this._networkGraph.selector) return;

    const connections = this._networkGraph.selector
      .select("g#connections")
      .selectAll("g.connection")
      .data(this.network.connections.all, (c: NESTConnection | any) => c.uuid);

    const dragging: TDragBehavior = drag()
      .on("start", (e: MouseEvent) => this._networkGraph.dragStart(e))
      .on("drag", (e: MouseEvent, c: NESTConnection | unknown) => this.drag(e, c as NESTConnection))
      .on("end", (e: MouseEvent) => this._networkGraph.dragEnd(e));

    connections
      .enter()
      .append("g")
      .attr("class", "connection")
      .attr("color", (c: NESTConnection) => c.sourceNode.view.color)
      .attr("idx", (c: NESTConnection) => c.idx)
      .attr("hash", (c: NESTConnection) => c.hash)
      .style("opacity", 0)
      .call(dragging, null)
      .each((c: NESTConnection, i: number, e) => this.init(c, i, e));

    connections.exit().remove();

    nextTick(() => this.render());
  }

  /**
   * Update style of the connections.
   */
  updateStyle(): void {
    select("g#connections").style("pointer-events", () =>
      this._networkGraph.workspace.state.dragLine && !this.network.nodes.isWeightRecorderSelected ? "none" : "",
    );
  }
}
