// norseNode.ts

import Mustache from "mustache";

import { BaseNode, NodeProps } from "@/helpers/node/baseNode";

import { NorseConnection } from "../connection/norseConnection";
import { NorseModel } from "../model/norseModel";

import { NorseNodes } from "./norseNodes";

export interface NorseNodeProps extends NodeProps {}

export class NorseNode extends BaseNode {
  private _code: string = "";

  constructor(nodes: NorseNodes, node: NorseNodeProps = {}) {
    super(nodes, node);
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
   *
   * @remarks
   * It initializes parameters and activity components.
   * It triggers node changes.
   *
   * @param model - node model
   */
  override set model(model: NorseModel) {
    this._modelId = model.id;
    this._model = model;
    this.modelChanges();
  }

  override get nodes(): NorseNodes {
    return this._nodes as NorseNodes;
  }

  /**
   * Clone this node component.
   * @return cloned node component
   */
  override clone(): NorseNode {
    return new NorseNode(this.nodes, { ...this.toJSON() });
  }

  override changes(): void {
    this.clean();
    this.state.updateHash();
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
  override init(node?: NodeProps): void {
    this.logger.trace("init");

    this.initParameters(node);

    if (this.model.isRecorder) {
      this.initActivity(node?.activity);
    }

    this.state.updateHash();

    setTimeout(() => this.generateCode(), 1);
  }
}
