// simulationCode.ts
import { AxiosResponse } from "axios";

import { IAxiosResponseData } from "@/stores/defineBackendStore";
import { ICodeProps } from "@/helpers/code/code";
import { SimulationCode } from "@/helpers/simulation/simulationCode";

import pynnSimulator from "../../stores/backends/pynnSimulatorStore";
import { PyNNProject } from "../project/project";

export class PyNNSimulationCode extends SimulationCode {
  constructor(project: PyNNProject, simulationCodeProps: ICodeProps = {}) {
    simulationCodeProps.templateFilename = "pynn-master";
    super(project, {
      ...simulationCodeProps,
      templateFilename: "pynn-master",
    });
  }

  /**
   * Execute simulation code.
   * @remarks It sends request to the backend to execute the code.
   */
  override async exec(): Promise<AxiosResponse<IAxiosResponseData>> {
    this.logger.trace("exec code");

    return pynnSimulator.exec(this.script);
  }

  /**
   * Import template from the file.
   * @return promise
   */
  override async importTemplate(): Promise<{ default: string }> {
    this.logger.trace("import template:", this.state.templateFilename);

    return import(`./templates/${this.state.templateFilename}.mustache?raw`);
  }
}
