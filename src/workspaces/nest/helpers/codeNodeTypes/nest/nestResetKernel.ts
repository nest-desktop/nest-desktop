// nestResetKernel.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "nest.ResetKernel",
  title: "reset kernel",
  codeTemplate: () => "nest.ResetKernel()",
});
