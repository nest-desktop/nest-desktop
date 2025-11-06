// examples/register.ts

import { addDefaultInterfaceTypes, type ICodeGraphViewModel } from "@babsey/code-graph";

import add from "./add";
import dictEntry from "./dictEntry";
import dynamicMath from "./dynamicMath";
import math from "./math";
import myFunction from "./myFunction";

const category = "examples";

export const registerExampleNodeTypes = (viewModel: ICodeGraphViewModel) => {
  addDefaultInterfaceTypes(viewModel);

  viewModel.editor.registerNodeType(add, { category });
  viewModel.editor.registerNodeType(dictEntry, { category });
  viewModel.editor.registerNodeType(dynamicMath, { category });
  viewModel.editor.registerNodeType(math, { category });
  viewModel.editor.registerNodeType(myFunction, { category });
};
