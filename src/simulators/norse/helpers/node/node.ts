// node.ts

import Mustache from "mustache";
import { nextTick } from "vue";

import { BaseNode, INodeProps } from "@/helpers/node/node";
import { INodeParamProps } from "@/helpers/node/nodeParameter";

import { NorseConnection } from "../connection/connection";
import { NorseModel } from "../model/model";
import { NorseSimulation } from "../simulation/simulation";
import { NorseNodes } from "./nodes";

export interface INorseNodeProps extends INodeProps {}

// export class NorseNode extends BaseNode<NorseModel> {
export class NorseNode extends BaseNode {
  private _code: string = "";

  constructor(nodes: NorseNodes, nodeProps: INorseNodeProps = {}) {
    super(nodes, nodeProps);
  }

  get code(): string {
    return this._code;
  }

  override get connections(): NorseConnection[] {
    return this.network.connections.all.filter(
      (connection: NorseConnection) => connection.sourceIdx === this.idx
    );
  }

  override get model(): NorseModel {
    if (this._model?.id !== this.modelId) {
      this._model = this.getModel(this.modelId);
    }
    return this._model as NorseModel;
  }

  override get nodes(): NorseNodes {
    return this._nodes as NorseNodes;
  }

  override get simulation(): NorseSimulation {
    return this.nodes.network.project.simulation as NorseSimulation;
  }

  /**
   * Clone this node component.
   * @return norse node object
   */
  override clone(): NorseNode {
    return new NorseNode(this.nodes, { ...this.toJSON() });
  }

  /**
   * Observer for node changes.
   *
   * @remarks
   * It emits network changes.
   */
  override changes(): void {
    this.logger.trace("changes");

    this.clean();
    this.updateHash();
    this.generateCode();

    this.nodes.network.changes();
  }

  /**
   * Generate code.
   */
  generateCode(): void {
    this._code = Mustache.render(this.model.codeTemplate, this);
  }

  /**
   * Load model.
   */
  override loadModel(paramsProps?: INodeParamProps[]): void {
    this.logger.trace("load model:", this._modelId, paramsProps);

    this._model = this.getModel(this._modelId);
    this.addParameters(paramsProps);

    this.generateCode();
  }
}
