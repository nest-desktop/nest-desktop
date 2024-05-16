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
  private _model: NorseModel;

  constructor(nodes: NorseNodes, nodeProps: INorseNodeProps = {}) {
    super(nodes, nodeProps);
    this._model = this.getModel(this._modelId);
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

  /**
   * Set model ID.
   */
  override set modelId(value: string) {
    this._modelId = value as string;
    this._model = this.getModel(value);

    this.updateParamsFromModel();
    this.modelChanges();
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
   * Get Norse model.
   */
  override getModel(modelId: string): NorseModel {
    this.logger.trace("get model:", modelId);

    return this.modelDBStore.getModel(modelId) as NorseModel;
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
