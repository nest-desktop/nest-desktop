// elephant/codeNodeTypes

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import elephantCV from "./elephantCV";
import elephantHomogeneousGammaProcess from "./elephantHomogeneousGammaProcess";
import elephantHomogeneousPoissonProcess from "./elephantHomogeneousPoissonProcess";
import elephantISI from "./elephantISI";
import elephantInstantaneousRate from "./elephantInstantaneousRate";
import elephantMeanFiringRate from "./elephantMeanFiringRate";
import elephantTimeHistogram from "./elephantTimeHistogram";

export const registerElephantNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  codeGraphStore.state.modules["elephant"] = "import elephant";
  codeGraphStore.state.modules["elephant.spike_train_generation"] = "import elephant";
  codeGraphStore.state.modules["elephant.statistics"] = "import elephant";
  codeGraphStore.state.modules["quantities"] = "import quantities as pq";

  const editor = codeGraphStore.editor;
  editor.registerNodeType(elephantHomogeneousGammaProcess, { category: "elephant.spike_train_generation" });
  editor.registerNodeType(elephantHomogeneousPoissonProcess, { category: "elephant.spike_train_generation" });
  editor.registerNodeType(elephantCV, { category: "elephant.statistics" });
  editor.registerNodeType(elephantISI, { category: "elephant.statistics" });
  editor.registerNodeType(elephantInstantaneousRate, { category: "elephant.statistics" });
  editor.registerNodeType(elephantMeanFiringRate, { category: "elephant.statistics" });
  editor.registerNodeType(elephantTimeHistogram, { category: "elephant.statistics" });
};
