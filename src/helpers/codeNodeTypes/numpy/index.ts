// codeNodeTypes/numpy

import { IBaklavaViewModel } from "baklavajs";

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import numpyArange from "./numpyArange";
import numpyArgwhere from "./numpyArgwhere";
import numpyConcatenate from "./numpyConcatenate";
import numpyConvolve from "./numpyConvolve";
import numpyCorrCoef from "./numpyCorrCoef";
import numpyCorrelate from "./numpyCorrelate";
import numpyFull from "./numpyFull";
import numpyHistogram from "./numpyHistogram";
import numpyLinspace from "./numpyLinspace";
import numpyRandomNormal from "./numpyRandomNormal";
import numpyRandomRandint from "./numpyRandomRandint";
import numpyRandomSeed from "./numpyRandomSeed";
import numpyRandomUniform from "./numpyRandomUniform";
import { addNumpyTypes } from "./interfaceTypes";

export const registerNumpyNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  codeGraphStore.state.modules["numpy"] = "import numpy as np";
  codeGraphStore.state.modules["numpy.random"] = "import numpy as np";
  addNumpyTypes(codeGraphStore.viewModel as IBaklavaViewModel);

  const editor = codeGraphStore.editor;
  editor.registerNodeType(numpyArange, { category: "numpy" });
  editor.registerNodeType(numpyArgwhere, { category: "numpy" });
  editor.registerNodeType(numpyConcatenate, { category: "numpy" });
  editor.registerNodeType(numpyConvolve, { category: "numpy" });
  editor.registerNodeType(numpyCorrCoef, { category: "numpy" });
  editor.registerNodeType(numpyCorrelate, { category: "numpy" });
  editor.registerNodeType(numpyFull, { category: "numpy" });
  editor.registerNodeType(numpyHistogram, { category: "numpy" });
  editor.registerNodeType(numpyLinspace, { category: "numpy" });
  editor.registerNodeType(numpyRandomNormal, { category: "numpy.random" });
  editor.registerNodeType(numpyRandomRandint, { category: "numpy.random" });
  editor.registerNodeType(numpyRandomSeed, { category: "numpy.random" });
  editor.registerNodeType(numpyRandomUniform, { category: "numpy.random" });
};
