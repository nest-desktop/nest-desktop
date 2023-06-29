// simulationCode.ts - 1 any

import Mustache from "mustache";
import { ILogObj, Logger } from "tslog";
import { reactive, UnwrapRef } from "vue";
import { sha1 } from "object-hash";

import { download } from "@/utils/download";
import { logger as mainLogger } from "@/utils/logger";

import { Simulation } from "./simulation";

export interface SimulationCodeProps {
  blocks?: string[];
}

interface SimulationCodeState {
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
  private _logger: Logger<ILogObj>;
  private _simulation: Simulation; // parent
  private _state: UnwrapRef<SimulationCodeState>;

  constructor(
    simulation: Simulation,
    simulationCode: SimulationCodeProps = {}
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

    this._logger = mainLogger.getSubLogger({
      name: `[${this._simulation.project.shortId}] simulation code`,
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

  get state(): UnwrapRef<SimulationCodeState> {
    return this._state;
  }

  get tagAnnotations(): boolean {
    return this._state.blocks.includes("tagAnnotations");
  }

  /**
   * Clean the simulation code.
   */
  clean(): void {
    this._logger.trace("clean code");
    if (!this.isInsiteReady) {
      this._state.blocks = this._state.blocks.filter(
        (item: String) => item !== "runSimulationInsite"
      );
    }
  }

  /**
   * Export the script to file.
   */
  export(format: string = "py"): void {
    this._logger.trace("export script to file:", format);
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
   * Renders the script and generates the hash.
   */
  generate(): void {
    if (this._state.template) {
      setTimeout(() => {
        this.script = Mustache.render(
          this._state.template || "",
          this._simulation.project
        );
        this.updateHash();
        this._logger.trace("generate");
      });
    } else {
      this.loadTemplate().then(() => this.generate());
    }
  }

  /**
   * Load template from json.
   * @return promise
   */
  async loadTemplate(): Promise<any> {
    this._logger.trace("load template");
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
  toJSON(): SimulationCodeProps {
    return { blocks: this._state.blocks };
  }

  updateHash(): void {
    this._state.hash = sha1({
      script: this._state.script,
    }).slice(0, 6);
    this._logger.settings.name = `[${this._simulation.project.shortId}] simulation code #${this._state.hash}`;
  }
}
