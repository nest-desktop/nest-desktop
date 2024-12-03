// highlightLine.ts

import { Extension, RangeSetBuilder } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";

export function highlightLineDeco(view: EditorView, lineNumber: number, className: string): DecorationSet {
  const builder = new RangeSetBuilder();
  for (const { from, to } of view.visibleRanges) {
    for (let pos = from; pos <= to; ) {
      const line = view.state.doc.lineAt(pos);
      if (line.number == lineNumber)
        builder.add(
          line.from,
          line.from,
          Decoration.line({
            attributes: { class: className },
          }),
        );
      pos = line.to + 1;
    }
  }
  return builder.finish() as DecorationSet;
}

export function highlightLine(lineNumber: number, className: string): Extension {
  const showHighlineLine = ViewPlugin.fromClass(
    class {
      className: string;
      decorations: DecorationSet;
      lineNumber: number;
      view: EditorView;

      constructor(view: EditorView) {
        this.lineNumber = lineNumber;
        this.view = view;
        this.className = className;
        this.decorations = this.updateDecorations();
      }

      update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged) this.decorations = this.updateDecorations();
      }

      updateClassName(className: string) {
        this.className = className;
        this.decorations = this.updateDecorations();
      }

      updateDecorations() {
        return highlightLineDeco(this.view, this.lineNumber, this.className);
      }

      updateLineNumber(lineNumber: number) {
        this.lineNumber = lineNumber;
        this.decorations = this.updateDecorations();
      }
    },
    {
      decorations: (v) => v.decorations,
    },
  );

  return showHighlineLine;
}
