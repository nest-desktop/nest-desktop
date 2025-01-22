// pynnNESTEnd.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "pyNN.nest.end",
  modules: ["pyNN.nest"],
  title: "end",
  codeTemplate: () => "pyNN.nest.end()",
});
