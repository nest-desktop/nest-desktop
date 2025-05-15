// norseIAFCell.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";

export default defineCodeNode({
  type: "norse.torch.IAFCell",
  title: "IAF cell",
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate: () => "norse.torch.IAFCell()",
  variableName: "model",
});
