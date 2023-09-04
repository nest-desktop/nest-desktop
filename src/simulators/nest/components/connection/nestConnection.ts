// nestConnection.ts

import {
  BaseConnection,
  ConnectionProps,
} from "@/components/connection/baseConnection";
import { ConnectionParameter } from "@/components/connection/connectionParameter";
import { NodeParameterProps } from "@/components/node/nodeParameter";

import { NESTConnectionMask, NESTConnectionMaskProps } from "./nestConnectionMask";
import { NESTConnections } from "./nestConnections";
import { NESTCopyModel } from "../model/nestCopyModel";
import { NESTModel } from "../model/nestModel";
import { NESTNetwork } from "../network/nestNetwork";
import { NESTNode } from "../node/nestNode";
import { NESTNodeSlice } from "../node/nestNodeSlice";
import { NESTSynapse, NESTSynapseProps } from "../synapse/nestSynapse";
import { NESTSynapseParameter } from "../synapse/nestSynapseParameter";


export interface NESTConnectionProps extends ConnectionProps {
  sourceSlice?: NodeParameterProps[];
  targetSlice?: NodeParameterProps[];
  mask?: NESTConnectionMaskProps;
  synapse?: NESTSynapseProps;
}

export class NESTConnection extends BaseConnection {
  private _mask: NESTConnectionMask;
  private _sourceSlice: NESTNodeSlice;
  private _synapse: NESTSynapse;
  private _targetSlice: NESTNodeSlice;

  constructor(connections: NESTConnections, connection: NESTConnectionProps) {
    super(connections, connection, "NESTConnection");

    this._sourceSlice = new NESTNodeSlice(this.source, []);
    this._targetSlice = new NESTNodeSlice(this.target, connection.targetSlice);

    this._mask = new NESTConnectionMask(this, connection.mask);
    this._synapse = new NESTSynapse(this, connection.synapse);
  }

  override get connections(): NESTConnections {
    return this.parent as NESTConnections
  }

  /**
   * Check if source and target nodes has positions.
   */
  get isBothSpatial(): boolean {
    return (
      this.source.spatial.hasPositions &&
      this.target.spatial.hasPositions
    );
  }

  get mask(): NESTConnectionMask {
    return this._mask;
  }

  get model(): NESTCopyModel | NESTModel {
    return this._synapse.model;
  }

  override get network(): NESTNetwork {
    return this.connections.network as NESTNetwork;
  }

  override get source(): NESTNode {
    return this.network.nodes.all[this.sourceIdx];
  }

  get sourceSlice(): NESTNodeSlice {
    return this._sourceSlice;
  }

  get synapse(): NESTSynapse {
    return this._synapse;
  }

  override get target(): NESTNode {
    return this.network.nodes.all[this.targetIdx];
  }

  get targetSlice(): NESTNodeSlice {
    return this._targetSlice;
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
      this._synapse.modelId !== "static_synapse" ||
      this._synapse.paramsVisible.length > 0
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
