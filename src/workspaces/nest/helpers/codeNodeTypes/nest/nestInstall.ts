// nestInstall.ts

import { displayInSidebar, setType, TextInputInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { stringType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "nest.Install",
  title: "install",
  inputs: {
    module_name: () =>
      new TextInputInterface("module name", "nestmlmodule").use(setType, stringType).use(displayInSidebar, true),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    return `nest.Install("${this.node.inputs.module_name.value}")`;
  },
});
