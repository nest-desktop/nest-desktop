// codeNodeTypes/torch

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import torchCat from "./torchCat";
import torchConv2d from "./torchConv2d";
import torchLinear from "./torchLinear";
import torchManualSeed from "./torchManualSeed";
import torchMaxPool2d from "./torchMaxPool2d";
import torchOnes from "./torchOnes";
import torchRand from "./torchRand";
import torchRandn from "./torchRandn";
import torchSin from "./torchSin";
import torchZeros from "./torchZeros";

export const registerTorchNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  const editor = codeGraphStore.editor;

  codeGraphStore.state.modules["torch"] = "import torch";

  editor.registerNodeType(torchCat, { category: "torch" });
  editor.registerNodeType(torchConv2d, { category: "torch.nn" });
  editor.registerNodeType(torchLinear, { category: "torch.nn" });
  editor.registerNodeType(torchManualSeed, { category: "torch" });
  editor.registerNodeType(torchMaxPool2d, { category: "torch.nn" });
  editor.registerNodeType(torchOnes, { category: "torch" });
  editor.registerNodeType(torchRand, { category: "torch" });
  editor.registerNodeType(torchRandn, { category: "torch" });
  editor.registerNodeType(torchSin, { category: "torch" });
  editor.registerNodeType(torchZeros, { category: "torch" });
};
