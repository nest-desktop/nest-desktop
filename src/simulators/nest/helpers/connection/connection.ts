// connection.ts

import {
  BaseConnection,
  ConnectionProps,
} from "@/helpers/connection/connection";
import { ConnectionParameter } from "@/helpers/connection/connectionParameter";
import { NodeParameterProps } from "@/helpers/node/nodeParameter";

import { NESTConnectionMask, NESTConnectionMaskProps } from "./connectionMask";
import { NESTConnections } from "./connections";
import { NESTCopyModel } from "../model/copyModel";
import { NESTModel } from "../model/model";
import { NESTNetwork } from "../network/network";
import { NESTNode } from "../node/node";
import { NESTNodeSlice } from "../node/nodeSlice";
import { NESTSynapse, NESTSynapseProps } from "../synapse/synapse";
import { NESTSynapseParameter } from "../synapse/synapseParameter";

export interface NESTConnectionProps extends ConnectionProps {
  sourceSlice?: NodeParameterProps[];
  targetSlice?: NodeParameterProps[];
  mask?: NESTConnectionMaskProps;
  synapse?: NESTSynapseProps;
}

export class NESTConnection extends BaseConnection {
  private _mask: NESTConnectionMask;
  private _sourceSlice: NESTNodeSlice;
  private _targetSlice: NESTNodeSlice;

  constructor(connections: NESTConnections, connection: NESTConnectionProps) {
    super(connections, connection, "NESTConnection");

    this._sourceSlice = new NESTNodeSlice(this.source, []);
    this._targetSlice = new NESTNodeSlice(this.target, connection.targetSlice);

    this._mask = new NESTConnectionMask(this, connection.mask);
  }

  override get connections(): NESTConnections {
    return this._connections as NESTConnections;
  }

  /**
   * Check if source and target nodes has positions.
   */
  get isBothSpatial(): boolean {
    return this.source.spatial.hasPositions && this.target.spatial.hasPositions;
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

  override get source(): NESTNode {
    return this.network.nodes.all[this.sourceIdx];
  }

  get sourceSlice(): NESTNodeSlice {
    return this._sourceSlice;
  }

  override get synapse(): NESTSynapse {
    return this._synapse as NESTSynapse;
  }

  override get target(): NESTNode {
    return this.network.nodes.all[this.targetIdx];
  }

  get targetSlice(): NESTNodeSlice {
    return this._targetSlice;
  }

  override newSynapse(synapse: NESTSynapseProps): NESTSynapse {
    return new NESTSynapse(this, synapse);
  }

  /**
   * Set defaults.
   *
   * @remarks
   * It emits connection changes.
   */
  override reset(): void {
    this.logger.trace("reset");
    this.rule.reset();
    this.initParameters();
    this.synapse.modelId = "static_synapse";
    this._mask.unmask();
    this.changes();
  }

  /**
   * Resets all parameters to their default.
   */
  override resetAllParams(): void {
    const ruleConfig: any = this.getRuleConfig();

    // Reset connection parameter.
    Object.values(this.params).forEach((param: ConnectionParameter) => {
      param.reset();
      const p: any = ruleConfig.params.find((p: any) => p.id === param.id);
      param.value = p.value;
    });

    // Reset synapse parameter.
    Object.values(this.synapse.params).forEach((param: NESTSynapseParameter) =>
      param.reset()
    );
  }

  /**
   * Serialize for JSON.
   * @return connection object
   */
  override toJSON(): NESTConnectionProps {
    const connection: NESTConnectionProps = {
      source: this.sourceIdx,
      target: this.targetIdx,
    };

    if (this.rule.value !== "all_to_all") {
      connection.rule = this.rule.value;
    }

    if (this.paramsVisible.length > 0) {
      connection.params = this.filteredParams.map(
        (param: ConnectionParameter) => param.toJSON()
      );
    }

    if (
      this.synapse.modelId !== "static_synapse" ||
      this.synapse.paramsVisible.length > 0
    ) {
      connection.synapse = this._synapse.toJSON();
    }

    if (this._sourceSlice.visible) {
      connection.sourceSlice = this._sourceSlice.toJSON();
    }

    if (this._targetSlice.visible) {
      connection.targetSlice = this._targetSlice.toJSON();
    }

    if (this._mask.hasMask) {
      connection.mask = this._mask.toJSON();
    }

    return connection;
  }
}
