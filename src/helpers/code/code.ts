// code.ts

import Mustache from "mustache";
import axios, { AxiosHeaders, AxiosResponse } from "axios";
import { IGraphState, IGraphTemplateState } from "baklavajs";
import { UnwrapRef, nextTick, reactive } from "vue";

import { IAxiosErrorData, IAxiosResponseData } from "@/stores/defineBackendStore";
import { TProject } from "@/types";

import { BaseObj } from "../common/base";
import { CodeGraph } from "../codeGraph/codeGraph";
import { download } from "../../utils/download";

export interface IResponseProps {
  data: object | string;
  config: object;
  headers: AxiosHeaders;
  request: XMLHttpRequest;
  status: number;
  statusText: string;
}

export interface ICodeProps {
  graph?: IGraphState;
  graphTemplates?: IGraphTemplateState[];
  templateFilename?: string;
}

interface ICodeState {
  error: IAxiosErrorData;
  script: string;
  template?: string;
  templateFilename: string;
}

export class BaseCode extends BaseObj {
  private _graph: CodeGraph;
  private _state: UnwrapRef<ICodeState>;
  public _project: TProject; // parent

  constructor(project: TProject, codeProps?: ICodeProps) {
    super();
    // this.logger.settings.minLevel = 1;

    this._project = project;
    this._state = reactive<ICodeState>({
      error: {
        lineNumber: -1,
        message: "",
      },
      script: "",
      template: "",
      templateFilename: "code",
    });

    if (codeProps) this._state.templateFilename = codeProps?.templateFilename ?? "code";
    if (this._state.templateFilename) this.loadTemplate();

    this._graph = new CodeGraph(this, codeProps);
    this.clean();
  }

  get graph(): CodeGraph {
    return this._graph;
  }

  get project(): TProject {
    return this._project;
  }

  get script(): string {
    return this._state.script;
  }

  set script(value: string) {
    this._state.script = value;
    this.updateHash();
  }

  get state(): UnwrapRef<ICodeState> {
    return this._state;
  }

  /**
   * Clean the code.
   */
  clean(): void {
    this.logger.trace("clean");

    // this.sortNodes();
    // this.graph.onUpdate();
  }

  /**
   * Execute code.
   * @remarks It sends request to the backend to execute the code.
   */
  async exec(): Promise<AxiosResponse<IAxiosResponseData>> {
    this.logger.trace("exec code");

    const axiosInstance = axios.create();
    return axiosInstance.get<IAxiosResponseData>("");
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
      const source: string[] = this._state.script.split("\n").map((s: string) => s + "\n");

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
        "\t",
      );
    }
    download(data, "script", format);
  }

  /**
   * Renders the script and generates the hash.
   */
  generate(): void {
    this.logger.trace("generate");

    if (!this.state.template) {
      this.loadTemplate().then(() => nextTick(() => this.generate()));
      return;
    }

    // Render code of nodes
    this.graph.renderCodes();

    // Render script of the code component.
    nextTick(() => this.renderCode());
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
   * Initialize code component.
   * @remarks It generates code.
   */
  init(): void {
    this.logger.trace("init");

    this.graph.init();
    this.generate();
  }

  // /**
  //  * Initialize code node graph.
  //  */
  // initGraph(): void {
  //   this.logger.trace("init graph");

  //   this.graph.init();
  // }

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
   * Observer for code changes.
   */
  onUpdate(): void {
    this.generate();
  }

  /**
   * Render code.
   */
  renderCode(): void {
    this.script = Mustache.render(this.state.template || "", this.graph);
  }

  /**
   * Reset error state.
   */
  resetErrorState(): void {
    this._state.error = {
      lineNumber: -1,
      message: "",
    };
  }

  /**
   * Sort code nodes.
   */
  // sortNodes(): void {}

  /**
   * Serialize for JSON.
   * @return code props
   */
  toJSON(): ICodeProps {
    return this.graph.state.editor;
  }

  /**
   * Update code.
   */
  update(): void {}

  /**
   * Update hash.
   */
  updateHash(): void {
    this._updateHash({
      script: this._state.script,
    });
  }
}
