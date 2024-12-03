// connection.ts

import {
  BaseConnection,
  IConnectionProps,
} from "@/helpers/connection/connection";
import { ConnectionParameter } from "@/helpers/connection/connectionParameter";
import { IParamProps } from "@/helpers/common/parameter";
import { NodeGroup } from "@/helpers/node/nodeGroup";

import { INESTConnectionMaskProps, NESTConnectionMask } from "./connectionMask";
import { INESTSynapseProps, NESTSynapse } from "../synapse/synapse";
import { NESTConnections } from "./connections";
import { NESTCopyModel } from "../model/copyModel";
import { NESTModel } from "../model/model";
import { NESTNetwork } from "../network/network";
import { NESTNode } from "../node/node";
import { NESTNodeSlice } from "../node/nodeSlice";
import { NESTSynapseParameter } from "../synapse/synapseParameter";

export interface INESTConnectionProps extends IConnectionProps {
  sourceSlice?: IParamProps[];
  targetSlice?: IParamProps[];
  mask?: INESTConnectionMaskProps;
  synapse?: INESTSynapseProps;
}

export class NESTConnection extends BaseConnection {
  private _mask: NESTConnectionMask;
  private _sourceSlice: NESTNodeSlice;
  private _targetSlice: NESTNodeSlice;

  constructor(
    connections: NESTConnections,
    connectionProps: INESTConnectionProps
  ) {
    super(connections, connectionProps, {
      name: "NESTConnection",
      simulator: "nest",
    });

    this._sourceSlice = new NESTNodeSlice(this.source, []);
    this._targetSlice = new NESTNodeSlice(
      this.target,
      connectionProps.targetSlice
    );

    this._mask = new NESTConnectionMask(this, connectionProps.mask);
  }

  override get Synapse() {
    return NESTSynapse;
  }

  override get connections(): NESTConnections {
    return this._connections as NESTConnections;
  }

  /**
   * Check if source and target nodes has positions.
   */
  get isBothSpatial(): boolean {
    return (
      this.sourceNode.spatial.hasPositions &&
      this.targetNode.spatial.hasPositions
    );
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

  override get source(): NESTNode | NodeGroup {
    return this.connections.network.nodes.all[this.sourceIdx] as
      | NESTNode
      | NodeGroup;
  }

  override get sourceNode(): NESTNode {
    return this.connections.network.nodes.all[this.sourceIdx] as NESTNode;
  }

  get sourceSlice(): NESTNodeSlice {
    return this._sourceSlice;
  }

  override get synapse(): NESTSynapse {
    return this._synapse as NESTSynapse;
  }

  override get target(): NESTNode | NodeGroup {
    return this.connections.network.nodes.all[this.targetIdx] as
      | NESTNode
      | NodeGroup;
  }

  override get targetNode(): NESTNode {
    return this.connections.network.nodes.all[this.targetIdx] as NESTNode;
  }

  get targetSlice(): NESTNodeSlice {
    return this._targetSlice;
  }

  /**
   * Set defaults.
   */
  override reset(): void {
    this.logger.trace("reset");

    this.rule.reset();
    this.addParameters();
    this.synapse.modelId = "static_synapse";
    this._mask.unmask();
  }

  /**
   * Resets all parameters to their default.
   */
  override resetParams(): void {
    // Reset connection parameter.
    this.paramsAll.forEach((param: ConnectionParameter) => param.reset());

    // Reset synapse parameter.
    this.synapse.paramsAll.forEach((param: NESTSynapseParameter) =>
      param.reset()
    );
  }

  /**
   * Serialize for JSON.
   * @return connection props
   */
  override toJSON(): INESTConnectionProps {
    const connectionProps: INESTConnectionProps = {
      source: this.sourceIdx,
      target: this.targetIdx,
    };

    if (this.rule.value !== "all_to_all") {
      connectionProps.rule = this.rule.value;
    }

    if (this.paramsVisible.length > 0) {
      connectionProps.params = this.filteredParams.map(
        (param: ConnectionParameter) => param.toJSON()
      );
    }

    if (
      this.synapse.modelId !== "static_synapse" ||
      this.synapse.paramsVisible.length > 0
    ) {
      connectionProps.synapse = this._synapse.toJSON();
    }

    if (this._sourceSlice.visible) {
      connectionProps.sourceSlice = this._sourceSlice.toJSON();
    }

    if (this._targetSlice.visible) {
      connectionProps.targetSlice = this._targetSlice.toJSON();
    }

    if (this._mask.hasMask) {
      connectionProps.mask = this._mask.toJSON();
    }

    return connectionProps;
  }
}
