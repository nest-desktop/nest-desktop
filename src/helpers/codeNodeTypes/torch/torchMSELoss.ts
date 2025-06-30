// torchMSELoss.ts

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "torch.nn.MSELoss",
  title: "MSE Loss",
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "loss_fn",
  codeTemplate() {
    if (!this.node) return this.type;
    return `nn.MSELoss()`;
  },
});
