// default/register.ts

import { addDefaultInterfaceTypes, type ICodeGraphViewModel } from "@babsey/code-graph";

import boolean from "./boolean";
import integer from "./integer";
import list from "./list";
import number from "./number";
import slider from "./slider";
import text from "./text";
import tuple from "./tuple";

export const registerDefaultNodeTypes = (viewModel: ICodeGraphViewModel) => {
  addDefaultInterfaceTypes(viewModel);

  viewModel.editor.registerNodeType(boolean);
  viewModel.editor.registerNodeType(integer);
  viewModel.editor.registerNodeType(list);
  viewModel.editor.registerNodeType(number);
  viewModel.editor.registerNodeType(slider);
  viewModel.editor.registerNodeType(text);
  viewModel.editor.registerNodeType(tuple);
};
