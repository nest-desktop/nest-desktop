// node.ts

import Mustache from "mustache";
import { nextTick } from "vue";

import { BaseNode, INodeProps } from "@/helpers/node/node";

import { NorseConnection } from "../connection/connection";
import { NorseModel } from "../model/model";
import { NorseNodes } from "./nodes";
import { NorseSimulation } from "../simulation/simulation";

export interface INorseNodeProps extends INodeProps {}

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
      this._model = this.getModel(this.modelId) as NorseModel;
    }
    return this._model as NorseModel;
  }

  /**
   * Set model.
   */
  override set model(model: NorseModel) {
    this._model = model;
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

  override changes(): void {
    this.clean();
    this.updateHash();
    this.generateCode();
    this.logger.trace("changes");
    this.nodes.network.changes();
  }

  generateCode(): void {
    this._code = Mustache.render(this.model.codeTemplate, this);
  }

  /**
   * Initialize node.
   */
  override init(): void {
    this.logger.trace("init");

    this.update();
    nextTick(() => this.generateCode());
  }
}
