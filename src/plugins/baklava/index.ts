// baklava/index.ts

import { Editor } from "baklavajs";
import { IViewSettings } from "@baklavajs/renderer-vue";

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import "@baklavajs/themes/dist/classic.css";
// import "@baklavajs/themes/dist/syrup-dark.css";
import "./baklava.scss";
import { registerCodeNodeTypes } from "@/helpers/codeNodeTypes";

export const baklavajs = {
  async install() {
    const codeGraphStore = useCodeGraphStore();
    setViewSettings(codeGraphStore.viewModel.settings);
    registerCodeNodeTypes(["base", "numpy", "pandas", "plotly", "brainscales2"]);
  },
};

export const setViewSettings = (settings: IViewSettings) => {
  // console.log("set settings");

  settings.displayValueOnHover = true;
  settings.enableMinimap = false;

  settings.nodes.defaultWidth = 350;
  settings.nodes.resizable = true;

  settings.sidebar.resizable = false;
  // settings.palette.enabled = false;

  // settings.contextMenu.additionalItems = [{ label: "edit", command: Commands.OPEN_SIDEBAR_COMMAND }];
};

export const subscribe = (editor: Editor, callback: () => void) => {
  editor.graphEvents.addNode.subscribe(Symbol(), () => callback());
  editor.graphEvents.addConnection.subscribe(Symbol(), () => callback());
  editor.graphEvents.removeNode.subscribe(Symbol(), () => callback());
  editor.graphEvents.removeConnection.subscribe(Symbol(), () => callback());
};
