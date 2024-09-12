// codemirror.ts

import { basicSetup } from "codemirror";
// import CodeMirror from "codemirror";
import VueCodemirror from "vue-codemirror";

import { darkMode } from "@/helpers/common/theme";
import { CompletionSource, autocompletion } from "@codemirror/autocomplete";
import { python } from "@codemirror/lang-python";
import { Compartment } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";

// import 'codemirror/mode/python/python.js';
// import 'codemirror/addon/selection/active-line.js';

// import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/base16-dark.css';

// import 'codemirror/addon/edit/closebrackets';
// import 'codemirror/addon/edit/matchbrackets';
// import 'codemirror/addon/hint/show-hint.css';

export default VueCodemirror;

// export function scrollTo(id: string, lineNumber: number) {
//   const editor = CodeMirror.fromTextArea(document.getElementById(id), {
//     mode: "xml",
//     theme: "default",
//     lineNumbers: true,
//   });

//   editor.setCursor(lineNumber);
// }

export function codemirrorExtensions(
  completionSources: CompletionSource[] | null | undefined
) {
  const language = new Compartment();

  const extensions = [
    basicSetup,
    language.of(python()),
    autocompletion({ override: completionSources }),
  ];

  if (darkMode()) {
    extensions.push(oneDark);
  }

  return extensions;
}
