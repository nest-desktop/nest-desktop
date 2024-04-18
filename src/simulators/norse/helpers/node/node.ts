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
   *
   * @remarks
   * It initializes parameters and activity components.
   * It triggers node changes.
   *
   * @param model - node model
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
   * @return cloned node component
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
  override init(nodeProps?: INodeProps): void {
    this.logger.trace("init");

    this.addParameters(nodeProps?.params);

    if (this.model.isRecorder) {
      this.createActivity(nodeProps?.activity);
    }

    this.updateHash();

    nextTick(() => this.generateCode());
  }
}
