// pynnNESTAllToAllConnector.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "pyNN.nest.AllToAllConnector",
  modules: ["pyNN.nest"],
  title: "all to all connector",
  codeTemplate: () => "pyNN.nest.AllToAllConnector()",
});
