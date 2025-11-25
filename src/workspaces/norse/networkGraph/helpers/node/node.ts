// node.ts

import { BaseNode } from "@/networkGraph/helpers/node/node";

import { NorseConnection } from "../connection/connection";
import { NorseModel } from "../../../helpers/model/model";
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
