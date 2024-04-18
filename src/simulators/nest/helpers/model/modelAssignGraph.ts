// modelAssignGraph.ts

import { Selection, select } from "d3";

import { drawPathMouse } from "@/helpers/connectionGraph/connectionGraphPath";
import { INetworkGraphWorkspaceState } from "@/helpers/networkGraph/networkGraphWorkspace";

import { NESTConnection } from "../connection/connection";
import { NESTCopyModel } from "./copyModel";
import { NESTNetworkGraph } from "../network/networkGraph";
import { NESTNode } from "../node/node";

export class NESTModelAssignGraph {
  private _networkGraph: NESTNetworkGraph;

  constructor(networkGraph: NESTNetworkGraph) {
    this._networkGraph = networkGraph;
  }

  get state(): INetworkGraphWorkspaceState {
    return this._networkGraph.workspace.state;
  }

  get strokeWidth(): number {
    return this._networkGraph.config?.localStorage.strokeWidth;
  }

  /**
   * Initialize a connection graph.
   */
  init(
    connection: NESTConnection,
    idx: number,
    elements: SVGGElement[] | ArrayLike<SVGGElement>
  ): void {
    const elem: Selection<any, any, any, any> = select(elements[idx]);

    elem.selectAll("*").remove();

    elem
      .append("path")
      .style("fill", "none")
      .style("stroke", "black")
      .style("opacity", 0)
      .style("stroke-width", 40);

    elem
      .append("path")
      .attr("class", "color")
      .attr("marker-end", `url(#assigned${connection.idx})`)
      .style("fill", "none")
      .style("pointer-events", "none")
      .style("stroke-width", this.strokeWidth);

    elem
      .on("mouseover", () => {
        connection.state.focus();
        this._networkGraph.update();
      })
      .on("mouseout", () => {
        this._networkGraph.network.nodes.unfocusNode();
        this._networkGraph.update();
      });
  }

  /**
   * Update connections in network graph.
   *
   * @remarks
   * This function should be called when connections in the network are changed.
   */
  update(): void {
    if (!this._networkGraph.selector) return;

    const models: Selection<any, any, any, any> = this._networkGraph.selector
      .select("g#modelAssigned")
      .selectAll("g.modelAssigned")
      .data(
        this._networkGraph.network.connections.recordedByWeightRecorder,
        (c: NESTConnection | any) => c.hash // TODO: no any!
      );

    models
      .enter()
      .append("g")
      .attr("class", "modelAssigned")
      .attr("idx", (c: NESTConnection) => c.idx)
      .attr("hash", (c: NESTConnection) => c.hash)
      .each((c: NESTConnection, i: number, e) => this.init(c, i, e));

    models.exit().remove();

    this.render();
  }

  /**
   * Render connection graphs.
   */
  render(): void {
    const selector = select("g#modelAssigned").selectAll("g.modelAssigned");
    selector.style("pointer-events", "none");

    // @ts-ignore - Argument of type '(connection: Connection, idx: number, elements: any[]) => void' is not assignable
    // to parameter of type 'ValueFn<BaseType, unknown, void>'.
    selector.each((connection: Connection, idx: number, elements: any[]) => {
      const elem = select(elements[idx]);
      const synapseModel = connection.synapse.model as NESTCopyModel;
      const weightRecorder = synapseModel.weightRecorder as NESTNode;

      if (weightRecorder) {
        elem
          .selectAll("path")
          .attr(
            "d",
            drawPathMouse(
              weightRecorder.view.state.position,
              connection.view.markerEndPosition
            )
          )
          .style("stroke-dasharray", 3);
        elem.select("path.color").style("stroke", weightRecorder.view.color);
      }
    });
  }
}
