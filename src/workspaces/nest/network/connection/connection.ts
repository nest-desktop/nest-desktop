// connection.ts

import type { AbstractCodeNode } from "@babsey/code-graph";

import { BaseConnection, ConnectionParameters, type IConnectionState } from "@/network";
import type { IParamState } from "@/parameter";
import type { Class } from "@/types";

import type { NESTNode } from "../node";
import type { NESTConnections } from "./connections";
import type { NESTCopyModel } from "../copyModel";
import type { NESTModel } from "../../model";
import type { NESTNetwork } from "../network";
import { getNESTConnectNode } from "../../codeNodeTypes/nest";
import { type INESTConnectionMaskState, NESTConnectionMask } from "./connectionMask";
import { type INESTSynapseState, NESTSynapse } from "../synapse";
// import { NESTNodeSlice } from "../node/nodeSlice";

export interface INESTConnectionState extends IConnectionState {
  sourceSlice?: IParamState[];
  targetSlice?: IParamState[];
  mask?: INESTConnectionMaskState;
  synapse?: INESTSynapseState;
}

export class NESTConnection extends BaseConnection<NESTConnections, INESTConnectionState> {
  private _mask: NESTConnectionMask;
  // private _sourceSlice: NESTNodeSlice;
  // private _targetSlice: NESTNodeSlice;

  constructor(connections: NESTConnections) {
    super(connections, {
      name: "NESTConnection",
      workspace: "nest",
    });

    // this._sourceSlice = new NESTNodeSlice(this.source);
    // this._targetSlice = new NESTNodeSlice(this.target);

    this._mask = new NESTConnectionMask(this);
  }

  override get ConnectionParameters(): Class<ConnectionParameters> {
    return ConnectionParameters<this>;
  }

  override get Synapse(): Class<NESTSynapse> {
    return NESTSynapse;
  }

  /**
   * Check if source and target nodes has positions.
   */
  get isBothSpatial(): boolean {
    return this.sourceNode.spatial.hasPositions && this.targetNode.spatial.hasPositions;
  }

  get mask(): NESTConnectionMask {
    return this._mask;
  }

  get model(): NESTCopyModel | NESTModel {
    return this.synapse.model;
  }

  override get network(): NESTNetwork {
    return this.connections.network;
  }

  get sourceNode(): NESTNode {
    return this.source as NESTNode;
  }

  // get sourceSlice(): NESTNodeSlice {
  //   return this._sourceSlice;
  // }

  override get synapse(): NESTSynapse {
    return this._synapse as NESTSynapse;
  }

  override get targetNode(): NESTNode {
    return this.target as NESTNode;
  }

  // get targetSlice(): NESTNodeSlice {
  //   return this._targetSlice;
  // }

  /**
   * Load connection from state.
   * @param connectionState connection state
   */
  override load(connectionState: IConnectionState): void {
    super.load(connectionState);

    this.synapse.load({ ...connectionState.synapse, model: "static_synapse" });
  }

  /**
   * Register code node.
   * @param codeNode code node
   */
  override registerCodeNode(codeNode?: AbstractCodeNode): void {
    if (!codeNode) codeNode = getNESTConnectNode(this.connections.network.project.code.graph, this.idx);
    this.codeNode = codeNode;
    this.codeNode.mask = this;
  }

  /**
   * Reset connection.
   */
  override reset(): void {
    this.logger.trace("reset");

    this.rule.reset();
    this.params.init();
    this.synapse.load({ model: "static_synapse" });
    this.mask.unmask();
  }

  /**
   * Save connection to state.
   * @return connection state
   */
  override save(): INESTConnectionState {
    const connectionState: INESTConnectionState = super.save();

    if (this.rule.value !== "all_to_all") connectionState.rule = this.rule.value;

    if (this.synapse.modelId !== "static_synapse" || this.synapse.params.hasSomeVisibleParams)
      connectionState.synapse = this.synapse.save();

    // if (this.sourceSlice.visible) connectionState.sourceSlice = this.sourceSlice.save();
    // if (this.targetSlice.visible) connectionState.targetSlice = this.targetSlice.save();
    if (this.mask.hasMask) connectionState.mask = this.mask.save();

    return connectionState;
  }
}
