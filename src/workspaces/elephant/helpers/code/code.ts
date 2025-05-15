// code.ts

import { AxiosResponse } from "axios";

import { BaseCode, ICodeProps } from "@/helpers/code/code";
import { IAxiosResponseData } from "@/stores/defineBackendStore";

import { ElephantProject } from "../project/project";
import elephant from "../../stores/backends/elephantServerStore";

export class ElephantCode extends BaseCode {
  constructor(project: ElephantProject, codeProps: ICodeProps = {}) {
    super(project, {
      ...codeProps,
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
}
