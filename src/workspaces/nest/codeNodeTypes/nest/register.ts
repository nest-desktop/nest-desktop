// nest/register.ts

import { type ICodeGraphViewModel } from "@babsey/code-graph";
// import { registerNumpyNodeTypes } from "../numpy";

import { registerCodeNodeModule } from "@/codeGraph";

import { nestConnect } from "./nestConnect";
import { nestCopyModel } from "./nestCopyModel";
import { nestCreate } from "./nestCreate";
import { nestDataResponse } from "./nestDataResponse";
import { nestGetPosition } from "./nestGetPosition";
import { nestInstall } from "./nestInstall";
import { nestParameters } from "./nestParameters";
import { nestPrepare } from "./nestPrepare";
import { nestRandomExponential } from "./nestRandomExponential";
import { nestRandomLognormal } from "./nestRandomLognormal";
import { nestRandomNormal } from "./nestRandomNormal";
import { nestRandomUniform } from "./nestRandomUniform";
import { nestRandomUniformInt } from "./nestRandomUniformInt";
import { nestResetKernel } from "./nestResetKernel";
import { nestSetKernelStatus } from "./nestSetKernelStatus";
import { nestSimulate } from "./nestSimulate";
import { nestSpatialFree } from "./nestSpatialFree";
import { nestSpatialGrid } from "./nestSpatialGrid";

export const registerNESTNodeTypes = (viewModel: ICodeGraphViewModel) => {
  let category: string;
  const editor = viewModel.editor;

  // registerNumpyNodeTypes(viewModel);

  category = "nest";
  editor.registerCategoryModule(category, "import nest");
  editor.registerNodeType(nestConnect, { category });
  editor.registerNodeType(nestCopyModel, { category });
  editor.registerNodeType(nestCreate, { category });
  editor.registerNodeType(nestDataResponse, { category });
  editor.registerNodeType(nestGetPosition, { category });
  editor.registerNodeType(nestInstall, { category });
  editor.registerNodeType(nestParameters, { category });
  editor.registerNodeType(nestPrepare, { category });
  editor.registerNodeType(nestResetKernel, { category });
  editor.registerNodeType(nestSetKernelStatus, { category });
  editor.registerNodeType(nestSimulate, { category });

  category = "nest.random";
  editor.registerCategoryModule(category, "import nest");
  editor.registerNodeType(nestRandomExponential, { category });
  editor.registerNodeType(nestRandomLognormal, { category });
  editor.registerNodeType(nestRandomNormal, { category });
  editor.registerNodeType(nestRandomUniform, { category });
  editor.registerNodeType(nestRandomUniformInt, { category });

  category = "nest.spatial";
  editor.registerCategoryModule(category, "import nest");
  editor.registerNodeType(nestSpatialFree, { category });
  editor.registerNodeType(nestSpatialGrid, { category });
};

registerCodeNodeModule("nest", registerNESTNodeTypes);
