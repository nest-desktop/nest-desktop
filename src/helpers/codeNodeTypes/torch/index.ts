// codeNodeTypes/torch

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import torchApplyModel from "./torchApplyModel";
import torchCat from "./torchCat";
import torchConv2d from "./torchConv2d";
import torchDevice from "./torchDevice";
import torchLinear from "./torchLinear";
import torchMSELoss from "./torchMSELoss";
import torchManualSeed from "./torchManualSeed";
import torchMaxPool2d from "./torchMaxPool2d";
import torchModule from "./torchModule";
import torchOnes from "./torchOnes";
import torchOptimAdam from "./torchOptimAdam";
import torchRand from "./torchRand";
import torchRandn from "./torchRandn";
import torchSin from "./torchSin";
import torchTensor from "./torchTensor";
import torchTrainModel from "./torchTrainModel";
import torchZeros from "./torchZeros";

export const registerTorchNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  codeGraphStore.state.modules["torch"] = "import torch";
  codeGraphStore.state.modules["torch.nn"] = "import torch.nn as nn";
  codeGraphStore.state.modules["torch.optim"] = "import torch.optim as optim";

  const editor = codeGraphStore.editor;
  editor.registerNodeType(torchApplyModel, { category: "torch" });
  editor.registerNodeType(torchCat, { category: "torch" });
  editor.registerNodeType(torchConv2d, { category: "torch.nn" });
  editor.registerNodeType(torchDevice, { category: "torch" });
  editor.registerNodeType(torchLinear, { category: "torch.nn" });
  editor.registerNodeType(torchMSELoss, { category: "torch.nn" });
  editor.registerNodeType(torchManualSeed, { category: "torch" });
  editor.registerNodeType(torchMaxPool2d, { category: "torch.nn" });
  editor.registerNodeType(torchModule, { category: "torch.nn" });
  editor.registerNodeType(torchOnes, { category: "torch" });
  editor.registerNodeType(torchOptimAdam, { category: "torch.optim" });
  editor.registerNodeType(torchRand, { category: "torch" });
  editor.registerNodeType(torchTrainModel, { category: "torch" });
  editor.registerNodeType(torchRandn, { category: "torch" });
  editor.registerNodeType(torchSin, { category: "torch" });
  editor.registerNodeType(torchTensor, { category: "torch" });
  editor.registerNodeType(torchZeros, { category: "torch" });
};
