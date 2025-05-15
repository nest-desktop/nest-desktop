// brainscales2AllToAllConnector.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "brainscales2.AllToAllConnector",
  title: "all to all connector",
  codeTemplate: () => "pynn.AllToAllConnector()",
});
