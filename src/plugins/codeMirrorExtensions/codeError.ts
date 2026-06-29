// codeError.ts

import { type UnwrapRef } from "vue";
import type { Extension } from "@codemirror/state";
import { type DecorationSet, EditorView, type Panel, ViewPlugin, ViewUpdate, showPanel } from "@codemirror/view";

import { IAxiosErrorData } from "@/backends";

import { highlightLineDeco } from "./highlightLine";

export function codeError(error: UnwrapRef<IAxiosErrorData>): Extension {
  const errorLine = ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;
      view: EditorView;

      constructor(view: EditorView) {
        this.view = view;
        this.decorations = highlightLineDeco(this.view, error.lineNumber, "cm-errorLine");
      }

      update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged) {
          error.lineNumber = -1;
          error.message = "";
        }

        this.decorations = highlightLineDeco(this.view, error.lineNumber, "cm-errorLine");
      }
    },
    {
      decorations: (v) => v.decorations,
    },
  );

  function showErrorMessage(): Panel {
    const dom = document.createElement("div");
    dom.textContent = error.message;
    return {
      dom,
      update() {
        dom.textContent = error.message;
      },
    };
  }

  function errorMessage() {
    return showPanel.of(showErrorMessage);
  }

  return [errorLine, errorMessage()];
}
