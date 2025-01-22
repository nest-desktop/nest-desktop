// codeNodeTypes/base

import { IBaklavaViewModel } from "baklavajs";
import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import apply from "./apply";
import comment from "./comment";
import dict from "./dict";
import functionNode from "./function";
import len from "./len";
import list from "./list";
import listComprehension from "./listComprehension";
import modifyListElement from "./modifyListElement";
import number from "./number";
import range from "./range";
import text from "./text";
import zip from "./zip";
import { addBaseTypes } from "./interfaceTypes";

export const registerBaseNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  addBaseTypes(codeGraphStore.viewModel as IBaklavaViewModel);

  const editor = codeGraphStore.editor;
  editor.registerNodeType(apply, { category: "base" });
  editor.registerNodeType(comment, { category: "base" });
  editor.registerNodeType(functionNode, { category: "base" });
  editor.registerNodeType(dict, { category: "base" });
  editor.registerNodeType(len, { category: "base" });
  editor.registerNodeType(list, { category: "base" });
  editor.registerNodeType(listComprehension, { category: "base" });
  editor.registerNodeType(modifyListElement, { category: "base" });
  editor.registerNodeType(number, { category: "base" });
  editor.registerNodeType(range, { category: "base" });
  editor.registerNodeType(text, { category: "base" });
  editor.registerNodeType(zip, { category: "base" });
};
