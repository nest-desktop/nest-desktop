// codeNodeTypes/nest

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import nestConnect from "./nestConnect";
import nestCopyModel from "./nestCopyModel";
import nestCreate from "./nestCreate";
import nestDataResponse from "./nestDataResponse";
import nestGetPosition from "./nestGetPosition";
import nestInstall from "./nestInstall";
import nestParameters from "./nestParameters";
import nestPrepare from "./nestPrepare";
import nestRandomExponential from "./nestRandomExponential";
import nestRandomLognormal from "./nestRandomLognormal";
import nestRandomNormal from "./nestRandomNormal";
import nestRandomUniform from "./nestRandomUniform";
import nestRandomUniformInt from "./nestRandomUniformInt";
import nestResetKernel from "./nestResetKernel";
import nestSetKernelStatus from "./nestSetKernelStatus";
import nestSimulate from "./nestSimulate";
import nestSpatialFree from "./nestSpatialFree";
import nestSpatialGrid from "./nestSpatialGrid";

export const registerNESTNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  const editor = codeGraphStore.editor;

  codeGraphStore.state.modules["nest"] = "import nest";

  editor.registerNodeType(nestConnect, { category: "nest" });
  editor.registerNodeType(nestCopyModel, { category: "nest" });
  editor.registerNodeType(nestCreate, { category: "nest" });
  editor.registerNodeType(nestDataResponse, { category: "nest" });
  editor.registerNodeType(nestGetPosition, { category: "nest" });
  editor.registerNodeType(nestInstall, { category: "nest" });
  editor.registerNodeType(nestParameters, { category: "nest" });
  editor.registerNodeType(nestPrepare, { category: "nest" });
  editor.registerNodeType(nestRandomExponential, { category: "nest.random" });
  editor.registerNodeType(nestRandomLognormal, { category: "nest.random" });
  editor.registerNodeType(nestRandomNormal, { category: "nest.random" });
  editor.registerNodeType(nestRandomUniform, { category: "nest.random" });
  editor.registerNodeType(nestRandomUniformInt, { category: "nest.random" });
  editor.registerNodeType(nestResetKernel, { category: "nest" });
  editor.registerNodeType(nestSetKernelStatus, { category: "nest" });
  editor.registerNodeType(nestSimulate, { category: "nest" });
  editor.registerNodeType(nestSpatialFree, { category: "nest.spatial" });
  editor.registerNodeType(nestSpatialGrid, { category: "nest.spatial" });
};
