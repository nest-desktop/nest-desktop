// node.ts

import { BaseNode } from "@/network/node";

import { NorseConnection } from "../connection";
import { NorseModel } from "../../../model";
import { NorseNodes } from "./nodes";

// export class NorseNode extends BaseNode<NorseModel> {
export class NorseNode extends BaseNode {
  override get connections(): NorseConnection[] {
    return super.connections as NorseConnection[];
  }

  override get model(): NorseModel {
    if (this._model?.id !== this.modelId) this._model = this.getModel(this.modelId);

    return this._model as NorseModel;
  }

  override get nodes(): NorseNodes {
    return this._nodes as NorseNodes;
  }
}
