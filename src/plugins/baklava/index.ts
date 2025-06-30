// baklava/index.ts

import { AbstractNode, Editor } from "baklavajs";
import { DEFAULT_TOOLBAR_COMMANDS, IBaklavaViewModel } from "@baklavajs/renderer-vue";

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import "@baklavajs/themes/dist/classic.css";
// import "@baklavajs/themes/dist/syrup-dark.css";
import "./baklava.scss";
import { registerCodeNodeTypes } from "@/helpers/codeNodeTypes";
import DeleteEmptyOutlineIcon from "@/components/iconsets/custom/DeleteEmptyOutlineIcon.vue";
import MapIcon from "@/components/iconsets/custom/MapIcon.vue";

export const baklavajs = {
  async install() {
    const codeGraphStore = useCodeGraphStore();
    setViewSettings(codeGraphStore.viewModel as IBaklavaViewModel);
    addClearAllCommand(codeGraphStore.viewModel as IBaklavaViewModel);
    registerCodeNodeTypes(["base", "numpy", "pandas", "plotly", "brainscales2"]);
  },
};

const addClearAllCommand = (baklavaView: IBaklavaViewModel) => {
  // Clear all nodes from the graph
  const CLEAR_ALL_COMMAND = "CLEAR_ALL";
  baklavaView.commandHandler.registerCommand(CLEAR_ALL_COMMAND, {
    execute: () => {
      baklavaView.displayedGraph.nodes.forEach((node: AbstractNode) => baklavaView.displayedGraph.removeNode(node));
    },
    canExecute: () => baklavaView.displayedGraph.nodes.length > 0,
  });

  // Toggle minimap
  const TOGGLE_MINIMAP_COMMAND = "TOGGLE_MINIMAP";
  baklavaView.commandHandler.registerCommand(TOGGLE_MINIMAP_COMMAND, {
    execute: () => (baklavaView.settings.enableMinimap = !baklavaView.settings.enableMinimap),
    canExecute: () => true,
  });

  baklavaView.settings.toolbar.commands = [
    // ...DEFAULT_TOOLBAR_COMMANDS.slice(0, 7),
    ...DEFAULT_TOOLBAR_COMMANDS,
    {
      command: CLEAR_ALL_COMMAND,
      title: "Clear All", // Tooltip text
      icon: DeleteEmptyOutlineIcon, // defineComponent(() => () => h("div", "clear all")),
    },
    {
      command: TOGGLE_MINIMAP_COMMAND,
      title: "Toggle minimap", // Tooltip text
      icon: MapIcon, // defineComponent(() => () => h("div", "clear all")),
    },
  ];
};

export const setViewSettings = (baklavaView: IBaklavaViewModel) => {
  baklavaView.settings.displayValueOnHover = true;
  baklavaView.settings.enableMinimap = false;

  baklavaView.settings.nodes.defaultWidth = 350;
  baklavaView.settings.nodes.resizable = true;

  baklavaView.settings.palette.enabled = true;
  baklavaView.settings.sidebar.resizable = false;
  baklavaView.settings.toolbar.enabled = true;
};

export const subscribe = (editor: Editor, callback: () => void) => {
  editor.graphEvents.addNode.subscribe(Symbol(), () => callback());
  editor.graphEvents.addConnection.subscribe(Symbol(), () => callback());
  editor.graphEvents.removeNode.subscribe(Symbol(), () => callback());
  editor.graphEvents.removeConnection.subscribe(Symbol(), () => callback());
};
