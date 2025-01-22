// codeNodeTypes/plotly

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

// import plotlyGraphObjectsBar from "./graph_objects/plotlyBar";
import plotlyBar from "./express/plotlyBar";
import plotlyDataResponse from "./plotlyDataResponse";
// import plotlyFigureAddTrace from "./plotlyFigureAddTrace";
// import plotlyGraphObjectsBar from "./graph_objects/plotlyBar";
// import plotlyGraphObjectsFigure from "./graph_objects/plotlyFigure";
// import plotlyGraphObjectsHeatmap from "./graph_objects/plotlyHeatmap";
// import plotlyGraphObjectsScatter from "./graph_objects/plotlyScatter";
// import plotlyGraphObjectsScattergl from "./graph_objects/plotlyScattergl";
import plotlyHistogram from "./express/plotlyHistogram";
import plotlyImshow from "./express/plotlyImshow";
import plotlyLine from "./express/plotlyLine";
// import plotlyMakeSubplots from "./plotlyMakeSubplots";
import plotlyScatter from "./express/plotlyScatter";

export const registerPlotlyNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  codeGraphStore.state.modules["plotly"] = "import plotly";
  codeGraphStore.state.modules["plotly.express"] = "import plotly.express as px";
  // codeGraphStore.state.modules["plotly.graph_objects"] = "import plotly.graph_objects as go";
  // codeGraphStore.state.modules["plotly.subplots"] = "import plotly.subplots as sp";

  const editor = codeGraphStore.editor;
  editor.registerNodeType(plotlyBar, { category: "plotly.express" });
  editor.registerNodeType(plotlyDataResponse, { category: "plotly" });
  // editor.registerNodeType(plotlyFigureAddTrace, { category: "plotly" });
  // editor.registerNodeType(plotlyGraphObjectsBar, { category: "plotly.graph_objects" });
  // editor.registerNodeType(plotlyGraphObjectsFigure, { category: "plotly.graph_objects" });
  // editor.registerNodeType(plotlyGraphObjectsHeatmap, { category: "plotly.graph_objects" });
  // editor.registerNodeType(plotlyGraphObjectsScatter, { category: "plotly.graph_objects" });
  // editor.registerNodeType(plotlyGraphObjectsScattergl, { category: "plotly.graph_objects" });
  editor.registerNodeType(plotlyHistogram, { category: "plotly.express" });
  editor.registerNodeType(plotlyImshow, { category: "plotly.express" });
  editor.registerNodeType(plotlyLine, { category: "plotly.express" });
  // editor.registerNodeType(plotlyMakeSubplots, { category: "plotly.subplots" });
  editor.registerNodeType(plotlyScatter, { category: "plotly.express" });
};
