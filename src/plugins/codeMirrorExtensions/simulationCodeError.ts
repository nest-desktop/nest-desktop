// simulationCodeError.ts

import { UnwrapRef } from "vue";

import { Extension } from "@codemirror/state";
import {
  DecorationSet,
  EditorView,
  Panel,
  ViewPlugin,
  ViewUpdate,
  showPanel,
} from "@codemirror/view";

import { highlightLineDeco } from "./highlightLine";

interface IErrorState {
  error: { message: string; lineNumber: number };
}

export function simulationCodeError(state: UnwrapRef<IErrorState>): Extension {
  const errorLine = ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;
      view: EditorView;

      constructor(view: EditorView) {
        this.view = view;
        this.decorations = highlightLineDeco(
          this.view,
          state.error.lineNumber,
          "cm-errorLine"
        );
      }

      update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged) {
          state.error.lineNumber = -1;
          state.error.message = "";
        }

        this.decorations = highlightLineDeco(
          this.view,
          state.error.lineNumber,
          "cm-errorLine"
        );
      }
    },
    {
      decorations: (v) => v.decorations,
    }
  );

  function showErrorMessage(): Panel {
    const dom = document.createElement("div");
    dom.textContent = state.error.message;
    return {
      dom,
      update() {
        dom.textContent = state.error.message;
      },
    };
  }

  function errorMessage() {
    return showPanel.of(showErrorMessage);
  }

  return [errorLine, errorMessage()];
}
