// myFunction.ts

import { allowMultipleConnections } from "@baklavajs/engine";

import {
  CheckboxInterface,
  CodeNodeOutputInterface,
  CodeNodeInputInterface,
  IntegerInterface,
  ListInputInterface,
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
  variableName: "f",
  inputs: {
    optional: () => new CodeNodeInputInterface("optional").setOptional(true),
    checkbox: () => new CheckboxInterface("checkbox", true),
    integer: () => new IntegerInterface("integer", 1),
    number: () => new NumberInterface("number", 1),
    select: () => new SelectInterface("select", "a", ["a", "b", "c"]),
    slider: () => new SliderInterface("slider", 0.5, 0, 1),
    text_input: () => new TextInputInterface("text input", "a"),
    textarea_input: () => new TextareaInputInterface("textarea input", "a"),
    list: () => new ListInputInterface("list"),
    multiple: () => new CodeNodeInputInterface<string[]>("multiple", []).use(allowMultipleConnections),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface(),
    custom: () => new CodeNodeOutputInterface(".custom", ".custom"),
  },
});
