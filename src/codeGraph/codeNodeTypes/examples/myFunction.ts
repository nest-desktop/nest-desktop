// text.ts

import {
  CheckboxInterface,
  CodeNodeOutputInterface,
  CodeNodeInputInterface,
  IntegerInterface,
  NumberInterface,
  SelectInterface,
  SliderInterface,
  TextInputInterface,
  TextareaInputInterface,
  defineCodeNode,
} from "@babsey/code-graph";

export default defineCodeNode({
  type: "myFunction",
  title: "my function",
  variableName: "a",
  inputs: {
    checkbox: () => new CheckboxInterface("checkbox", true).setOptional(true),
    integer: () => new IntegerInterface("integer", 1).setOptional(true),
    number: () => new NumberInterface("number", 1).setOptional(true),
    select: () => new SelectInterface("select", "a", ["a", "b", "c"]).setOptional(true),
    slider: () => new SliderInterface("slider", 0.5, 0, 1).setOptional(true),
    text_input: () => new TextInputInterface("text input", "a").setOptional(true),
    textarea_input: () => new TextareaInputInterface("textarea input", "a").setOptional(true),
    code_node_input: () => new CodeNodeInputInterface("code node input").setOptional(true),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface(),
    custom: () => new CodeNodeOutputInterface(".custom", ".custom").setOptional(true),
  },
  // codeTemplate() {
  //   return `myFunction(${formatInputs(this.codeNodeInputs).join(', ')})`
  // },
});
