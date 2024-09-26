// codemirror.ts

import { basicSetup } from "codemirror";
// import { nestml } from "codemirror-lang-nestml";
import VueCodemirror from "vue-codemirror";

import { autocompletion } from "@codemirror/autocomplete";
import { json } from "@codemirror/lang-json";
import { python } from "@codemirror/lang-python";
import { yaml } from "@codemirror/lang-yaml";
import { Compartment, Extension } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";

import { highlightLine } from "./codeMirrorExtensions/highlightLine";
import { simulationCodeError } from "./codeMirrorExtensions/simulationCodeError";
import { zebraStripes } from "./codeMirrorExtensions/zebraStripes";

export default VueCodemirror;

function languageJSON(): Extension[] {
  const language = new Compartment();
  return [language.of(json())];
}

// function languageNESTML(): Extension[] {
//   const language = new Compartment();
//   return [language.of(nestml())];
// }

function languagePython(): Extension[] {
  const language = new Compartment();
  return [language.of(python())];
}

function languageYAML(): Extension[] {
  const language = new Compartment();
  return [language.of(yaml())];
}

export {
  autocompletion,
  basicSetup,
  languageJSON,
  // languageNESTML,
  languagePython,
  languageYAML,
  oneDark,
  zebraStripes,
  highlightLine,
  simulationCodeError,
};
