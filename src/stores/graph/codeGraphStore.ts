// codeGraphStore.ts

import { defineStore } from "pinia";

import { useCodeGraph } from "@babsey/code-graph";

import { registerNodeTypes } from "@/codeGraph/codeNodeTypes";
import { PythonCode } from "@/codeGraph/code";

export const useCodeGraphStore = defineStore("code-graph", () => {
  const viewModel = useCodeGraph({code: new PythonCode()});
  registerNodeTypes(viewModel);

  return { viewModel };
});
