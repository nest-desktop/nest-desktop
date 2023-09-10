// baseSimulationCode.ts

import Mustache from "mustache";
import { ILogObj, Logger } from "tslog";
import { reactive, UnwrapRef } from "vue";
import { sha1 } from "object-hash";

import { Simulation } from "@/types/simulationTypes";
import { download } from "@/utils/download";
import { logger as mainLogger } from "@/helpers/common/logger";

export interface SimulationCodeProps {
  blocks?: string[];
  templateFilename?: string;
}

interface SimulationCodeState {
  blocks: string[];
  customBlocks: boolean,
  templateFilename: string;
  hash: string;
  template?: string;
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

export class BaseSimulationCode {
  private _logger: Logger<ILogObj>;
  private _simulation: Simulation; // parent
  private _state: UnwrapRef<SimulationCodeState>;

  constructor(simulation: Simulation, simulationCode?: SimulationCodeProps) {
    this._simulation = simulation;
    this._state = reactive({
      blocks: simulationCode?.blocks || simulationCodeBlocks,
      customBlocks: false,
      templateFilename: simulationCode?.templateFilename || "",
      template: "",
      hash: "",
      script: "",
    });

    this._logger = mainLogger.getSubLogger({
      name: `[${this.simulation.project.shortId}] simulation code`,
    });

    if (this._state.templateFilename) {
      this.loadTemplate();
    }
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

  get logger(): Logger<ILogObj> {
    return this._logger;
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

  get simulationAllTypes(): Simulation {
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
    this._logger.trace("generate");
    if (this._state.template) {
      setTimeout(() => {
        this.script = Mustache.render(
          this._state.template || "",
          this.simulation.project
        );
        this.updateHash();
      });
    } else {
      this.loadTemplate().then(() => this.generate());
    }
  }

  /**
   * Import template from the file.
   * @return promise
   */
  async importTemplate(): Promise<any> {
    this._logger.trace("import template:", this._state.templateFilename);
    return import(`./templates/${this._state.templateFilename}.mustache?raw`);
  }

  /**
   * Load template.
   * @return promise
   */
  async loadTemplate(): Promise<any> {
    this._logger.trace("load template:", this._state.templateFilename);
    return this.importTemplate().then((template) => {
      this._state.template = template.default;
    });
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
    this._logger.settings.name = `[${this.simulation.project.shortId}] simulation code #${this._state.hash}`;
  }
}
