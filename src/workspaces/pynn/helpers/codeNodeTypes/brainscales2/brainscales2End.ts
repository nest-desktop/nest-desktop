// brainscales2End.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "brainscales2.end",
  title: "end",
  codeTemplate: () => "pynn.end()",
});
