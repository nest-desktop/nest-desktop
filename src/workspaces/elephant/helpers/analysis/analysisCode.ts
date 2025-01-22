// analysisCode.ts

import { AxiosResponse } from "axios";

import { BaseCode, ICodeProps } from "@/helpers/code/code";
import { IAxiosResponseData } from "@/stores/defineBackendStore";

import { ElephantProject } from "../project/project";
import elephant from "../../stores/backends/elephantServerStore";

export class ElephantAnalysisCode extends BaseCode {
  constructor(project: ElephantProject, codeProps: ICodeProps = {}) {
    codeProps.templateFilename = "elephant-master";
    super(project, {
      ...codeProps,
      templateFilename: "elephant-master",
    });
  }

  /**
   * Execute analysis code.
   * @remarks It sends request to the backend to execute the code.
   */
  override async exec(): Promise<AxiosResponse<IAxiosResponseData>> {
    this.logger.trace("exec code");

    return elephant.exec(this.script);
  }

  /**
   * Import template from the file.
   * @return Promise of string
   */
  override async importTemplate(): Promise<{ default: string }> {
    this.logger.trace("import template:", this.state.templateFilename);

    return import(`./templates/${this.state.templateFilename}.mustache?raw`);
  }
}
