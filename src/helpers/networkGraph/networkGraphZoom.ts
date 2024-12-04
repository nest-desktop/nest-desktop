// networkGraphZoom.ts

import { ZoomBehavior, zoom } from "d3";

import { NetworkGraphWorkspace } from "./networkGraphWorkspace";

export class NetworkGraphZoom {
  private _handler: ZoomBehavior<any, any>;
  private _transform: { k: number; x: number; y: number } = {
    k: 1,
    x: 0,
    y: 0,
  };
  private _workspace: NetworkGraphWorkspace;

  constructor(networkGraphWorkspace: NetworkGraphWorkspace) {
    this._workspace = networkGraphWorkspace;
    this._handler = zoom();

    this.init();
  }

  get handler(): ZoomBehavior<any, any> {
    return this._handler;
  }

  get height(): number {
    return this._workspace.size.height;
  }

  get transform(): { k: number; x: number; y: number } {
    return this._transform;
  }

  get width(): number {
    return this._workspace.size.width;
  }

  /**
   * Initialize zoom handler.
   */
  init(): void {
    this._handler
      .extent([
        [0, 0],
        [this.width, this.height],
      ])
      .scaleExtent([0.5, 2])
      .on("start", () => this._workspace.handler.style("cursor", "move"))
      .on("zoom", ({ transform }) => {
        this._transform = transform;
        if (this._workspace.state.transforming) {
          this._workspace.selector.transition().attr("transform", transform);
        } else {
          this._workspace.selector.attr("transform", transform);
        }
      })
      .on("end", () => {
        this._workspace.handler.style("cursor", "default");
        this._workspace.networkGraph.nodeGraph.render();
      });
  }
}
