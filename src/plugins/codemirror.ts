// codemirror.ts

import { basicSetup } from "codemirror";
import VueCodemirror from "vue-codemirror";

import { autocompletion } from "@codemirror/autocomplete";
import { json } from "@codemirror/lang-json";
import { python } from "@codemirror/lang-python";
import { Compartment, Extension } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";

import { highlightLine } from "./codeMirrorExtensions/highlightLine";
import { simulationCodeError } from "./codeMirrorExtensions/simulationCodeError";
import { zebraStripes } from "./codeMirrorExtensions/zebraStripes";

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
