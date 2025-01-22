// blank.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "blank",
  title: "blank",
  codeTemplate: () => "",
});
