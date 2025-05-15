// nestPrepare.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "nest.Prepare",
  title: "prepare",
  codeTemplate: () => "nest.Prepare()",
});
