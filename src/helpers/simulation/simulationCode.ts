// simulationCode.ts

import Mustache from "mustache";
import { UnwrapRef, nextTick, reactive } from "vue";

import { BaseObj } from "../common/base";
import { TSimulation } from "@/types/simulationTypes";
import { download } from "../common/download";

export interface ISimulationCodeProps {
  blocks?: string[];
  templateFilename?: string;
}

interface ISimulationCodeState {
  blocks: string[];
  customBlocks: boolean;
  templateFilename: string;
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

export class BaseSimulationCode extends BaseObj {
  private _simulation: TSimulation; // parent
  private _state: UnwrapRef<ISimulationCodeState>;

  constructor(
    simulation: TSimulation,
    simulationCodeProps?: ISimulationCodeProps
  ) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._simulation = simulation;
    this._state = reactive({
      blocks: simulationCodeProps?.blocks || simulationCodeBlocks,
      customBlocks: false,
      templateFilename: simulationCodeProps?.templateFilename || "",
      template: "",
      script: "",
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
    this.updateHash();
  }

  get setKernelStatus(): boolean {
    return this._state.blocks.includes("setKernel");
  }

  get simulation(): TSimulation {
    return this._simulation;
  }

  get simulationAllTypes(): TSimulation {
    return this._simulation;
  }

  get state(): UnwrapRef<ISimulationCodeState> {
    return this._state;
  }

  get tagAnnotations(): boolean {
    return this._state.blocks.includes("tagAnnotations");
  }

  /**
   * Clean the simulation code.
   */
  clean(): void {
    this.logger.trace("clean");
  }

  /**
   * Export the script to file.
   */
  export(format: string = "py"): void {
    this.logger.trace("export script to file:", format);
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
    this.logger.trace("generate");
    if (this._state.template) {
      this.script = Mustache.render(
        this._state.template || "",
        this.simulation.project
      );
      this.updateHash();
    } else {
      this.loadTemplate().then(() => nextTick(() => this.generate()));
    }
  }

  /**
   * Import template from the file.
   * @return promise
   */
  async importTemplate(): Promise<{ default: string }> {
    this.logger.trace("import template:", this._state.templateFilename);
    return import(`./templates/${this._state.templateFilename}.mustache?raw`);
  }

  /**
   * Initialize simulation code component.
   *
   * @remarks
   * It generates simulation code.
   */
  init(): void {
    this.logger.trace("init");
    this.generate();
  }

  /**
   * Load template.
   */
  async loadTemplate(): Promise<void> {
    this.logger.trace("load template:", this._state.templateFilename);
    return this.importTemplate().then((template: { default: string }) => {
      this._state.template = template.default;
    });
  }

  /**
   * Serialize for JSON.
   * @return simulation code props
   */
  toJSON(): ISimulationCodeProps {
    return { blocks: this._state.blocks };
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._updateHash({
      script: this._state.script,
    });
  }
}
