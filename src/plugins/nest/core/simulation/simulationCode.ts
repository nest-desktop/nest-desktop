// simulationCode.ts - 1 any

import { reactive, UnwrapRef } from "vue";
import { sha1 } from "object-hash";
import Mustache from "mustache";

import { download } from "@/helpers/download";

import { Simulation } from "./simulation";

export interface simulationCodeProps {
  blocks?: string[];
}

interface simulationCodeState {
  codeInsite: boolean;
  blocks: string[];
  version: string;
  template?: string;
  hash: string;
  script: string;
}

const simulationCodeBlocks: string[] = [
  "importModules",
  "resetKernel",
  "setKernel",
  "createNodes",
  "connectNodes",
  "runSimulation",
];

export class SimulationCode {
  private _simulation: Simulation; // parent
  private _state: UnwrapRef<simulationCodeState>;

  constructor(
    simulation: Simulation,
    simulationCode: simulationCodeProps = {}
  ) {
    this._simulation = simulation;
    this._state = reactive({
      codeInsite: false,
      blocks: simulationCode.blocks || simulationCodeBlocks,
      version: "nest-master",
      template: "",
      hash: "",
      script: "",
    });

    this.loadTemplate();
    this.clean();
  }

  get createNodes(): boolean {
    return this._state.blocks.includes("createNodes");
  }

  get connectNodes(): boolean {
    return this._state.blocks.includes("connectNodes");
  }

  get importModules(): boolean {
    return this._state.blocks.includes("importModules");
  }

  get isInsiteReady(): boolean {
    return false;
    // return this._simulation.project.app.backends.insiteAccess.state.ready;
  }

  get resetKernel(): boolean {
    return this._state.blocks.includes("resetKernel");
  }

  get prepareSimulation(): boolean {
    return !this._state.blocks.includes("runSimulation");
  }

  get runSimulation(): boolean {
    return this._state.blocks.includes("runSimulation");
  }

  get runSimulationInsite(): boolean {
    return this._state.blocks.includes("runSimulationInsite");
  }

  get script(): string {
    return this._state.script;
  }

  set script(value: string) {
    this._state.script = value;
    this._state.hash = sha1(this._state.script);
  }

  get setKernelStatus(): boolean {
    return this._state.blocks.includes("setKernel");
  }

  /**
   * Returns the first six digits of the SHA-1 project code hash.
   * @returns 6-digit id value
   */
  get shortHash(): string {
    return this._state.hash ? this._state.hash.slice(0, 6) : "";
  }

  get simulation(): Simulation {
    return this._simulation;
  }

  get state(): UnwrapRef<simulationCodeState> {
    return this._state;
  }

  get tagAnnotations(): boolean {
    return this._state.blocks.includes("tagAnnotations");
  }

  /**
   * Clean the simulation code.
   */
  clean(): void {
    if (!this.isInsiteReady) {
      this._state.blocks = this._state.blocks.filter(
        (item: String) => item !== "runSimulationInsite"
      );
    }
  }

  /**
   * Renders the script and generates the hash.
   */
  generate(): void {
    // console.log("Generate simulation code");
    if (this._state.template) {
      setTimeout(() => {
        this.script = Mustache.render(
          this._state.template || "",
          this._simulation.project
        );
      });
    } else {
      this.loadTemplate().then(() => this.generate());
    }
  }

  /**
   * Export the script to file.
   */
  export(format: string = "py"): void {
    let data: string = "";
    if (format === "py") {
      data = this._state.script;
    } else if (format === "ipynb") {
      const source: string[] = this._state.script
        .split("\n")
        .map((s: string) => s + "\n");

      data = JSON.stringify(
        {
          cells: [
            {
              cell_type: "code",
              execution_count: null,
              id: "nest-desktop",
              metadata: {},
              outputs: [],
              source,
            },
          ],
          metadata: {
            language_info: {
              codemirror_mode: {
                name: "ipython",
                version: 3,
              },
              file_extension: ".py",
              mimetype: "text/x-python",
              name: "python",
              nbconvert_exporter: "python",
              pygments_lexer: "ipython3",
              version: "3.8.10",
            },
          },
          nbformat: 4,
          nbformat_minor: 5,
        },
        null,
        "\t"
      );
    }
    download(data, "script", format);
  }

  /**
   * Load template from json.
   * @return promise
   */
  async loadTemplate(): Promise<any> {
    return import(`./simulationCodes/${this._state.version}.code?raw`).then(
      (template) => {
        this.state.template = template.default;
      }
    );
  }

  /**
   * Serialize for JSON.
   * @return simulation code object
   */
  toJSON(): simulationCodeProps {
    return { blocks: this._state.blocks };
  }
}
