// baklava/index.ts

import { DEFAULT_TOOLBAR_COMMANDS } from "@baklavajs/renderer-vue";
import { Editor } from "baklavajs";
import { IViewSettings } from "@baklavajs/renderer-vue";
import { defineComponent, h } from "vue";

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import "@baklavajs/themes/dist/classic.css";
// import "@baklavajs/themes/dist/syrup-dark.css";
import "./baklava.scss";
import { registerCodeNodeTypes } from "@/helpers/codeNodeTypes";

export const baklavajs = {
  async install() {
    const codeGraphStore = useCodeGraphStore();
    const baklavaView = codeGraphStore.viewModel;
    setViewSettings(baklavaView.settings);
    registerCodeNodeTypes(["base", "numpy", "pandas", "plotly", "brainscales2"]);

    // 1. Register a custom command
    const CLEAR_ALL_COMMAND = "CLEAR_ALL";
    baklavaView.commandHandler.registerCommand(CLEAR_ALL_COMMAND, {
      execute: () => {
        // Clear all nodes from the graph
        baklavaView.displayedGraph.nodes.forEach((node) => {
          baklavaView.displayedGraph.removeNode(node);
        });
      },
      // Optional: Define when the command can be executed
      canExecute: () => baklavaView.displayedGraph.nodes.length > 0,
    });

    // 2. & 3. Add the command to the toolbar
    baklavaView.settings.toolbar.commands = [
      ...DEFAULT_TOOLBAR_COMMANDS,
      {
        command: CLEAR_ALL_COMMAND,
        title: "Clear All", // Tooltip text
        icon: defineComponent(() => {
          return () => h("div", "Clear All");
        }),
      },
    ];
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
