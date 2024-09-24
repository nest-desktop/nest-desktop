// codemirror.ts

import { basicSetup } from "codemirror";
// import CodeMirror from "codemirror";
import VueCodemirror from "vue-codemirror";

import { autocompletion } from "@codemirror/autocomplete";
import { json } from "@codemirror/lang-json";
import { python } from "@codemirror/lang-python";
import { Compartment, Extension } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";

import { highlightLine } from "./codeMirrorExtensions/highlightLine";
import { simulationCodeError } from "./codeMirrorExtensions/simulationCodeError";
import { zebraStripes } from "./codeMirrorExtensions/zebraStripes";

// import 'codemirror/mode/python/python.js';
// import 'codemirror/addon/selection/active-line.js';

// import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/base16-dark.css';

// import 'codemirror/addon/edit/closebrackets';
// import 'codemirror/addon/edit/matchbrackets';
// import 'codemirror/addon/hint/show-hint.css';

export default VueCodemirror;

function languagePython(): Extension[] {
  const language = new Compartment();
  return [language.of(python())];
}

function languageJSON(): Extension[] {
  const language = new Compartment();
  return [language.of(json())];
}

export {
  autocompletion,
  basicSetup,
  languageJSON,
  languagePython,
  oneDark,
  zebraStripes,
  highlightLine,
  simulationCodeError,
};
