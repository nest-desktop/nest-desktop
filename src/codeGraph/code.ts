// code.ts

import { Code } from "@babsey/code-graph";

export class PythonCode extends Code {
  constructor() {
    super();

    this.loadTemplate(import("./templates/python.mustache?raw"));
  }
}
