// connection.ts

import { BaseConnection, type IConnectionState } from "@/networkGraph/helpers/connection/connection";
import type { IParamState } from "@/helpers/common/parameter";
import type { Class, TNodeGroup } from "@/types";

import { type INESTConnectionMaskState, NESTConnectionMask } from "./connectionMask";
import { type INESTSynapseState, NESTSynapse } from "../synapse/synapse";
import { NESTConnections } from "./connections";
import { NESTCopyModel } from "../model/copyModel";
import { NESTModel } from "../../../helpers/model/model";
import { NESTNetwork } from "../network/network";
import { NESTNode } from "../node/node";
// import { NESTNodeSlice } from "../node/nodeSlice";

export interface INESTConnectionState extends IConnectionState {
  sourceSlice?: IParamState[];
  targetSlice?: IParamState[];
  mask?: INESTConnectionMaskState;
  synapse?: INESTSynapseState;
}

export class NESTConnection extends BaseConnection {
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

  override get Synapse(): Class<NESTSynapse> {
    return NESTSynapse;
  }

  override get connections(): NESTConnections {
    return this._connections as NESTConnections;
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

  // override get source(): NESTNode | TNodeGroup {
  //   return this.connections.network.nodes.all[this.source?.idx] as NESTNode | TNodeGroup;
  // }

  // override get sourceNode(): NESTNode {
  //   return this.connections.network.nodes.all[this.source?.idx] as NESTNode;
  // }

  // get sourceSlice(): NESTNodeSlice {
  //   return this._sourceSlice;
  // }

  override get synapse(): NESTSynapse {
    return this._synapse as NESTSynapse;
  }

  // override get target(): NESTNode | TNodeGroup {
  //   return this.connections.network.nodes.all[this.target?.idx] as NESTNode | TNodeGroup;
  // }

  // override get targetNode(): NESTNode {
  //   return this.connections.network.nodes.all[this.target?.idx] as NESTNode;
  // }

  // get targetSlice(): NESTNodeSlice {
  //   return this._targetSlice;
  // }

  /**
   * Set defaults.
   */
  override reset(): void {
    this.logger.trace("reset");

    this.rule.reset();
    this.params.init();
    this.synapse.modelId = "static_synapse";
    this._mask.unmask();
  }

  // /**
  //  * Resets all parameters to their default.
  //  */
  // override resetParams(): void {
  //   // Reset connection parameter.
  //   this.paramsAll.forEach((param: ConnectionParameter) => param.reset());

  //   // Reset synapse parameter.
  //   this.synapse.paramsAll.forEach((param: NESTSynapseParameter) => param.reset());
  // }

  /**
   * Save connection to state.
   * @return connection state
   */
  override save(): INESTConnectionState {
    const connectionState: INESTConnectionState = super.save();

    if (this.rule.value !== "all_to_all") connectionState.rule = this.rule.value;

    if (this.synapse.modelId !== "static_synapse" || this.synapse.params.paramsVisible.length > 0)
      connectionState.synapse = this.synapse.save();

    // if (this.sourceSlice.visible) connectionState.sourceSlice = this.sourceSlice.save();
    // if (this.targetSlice.visible) connectionState.targetSlice = this.targetSlice.save();
    if (this.mask.hasMask) connectionState.mask = this.mask.save();

    return connectionState;
  }
}
