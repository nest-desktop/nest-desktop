// simulationCode.ts

import { AxiosResponse } from "axios";

import { ICodeProps } from "@/helpers/code/code";
import { IAxiosResponseData } from "@/stores/defineBackendStore";

import norseSimulator from "../../stores/backends/norseSimulatorStore";
import { NorseProject } from "../project/project";
import { SimulationCode } from "@/helpers/simulation/simulationCode";

export class NorseSimulationCode extends SimulationCode {
  constructor(project: NorseProject, simulationCodeProps: ICodeProps = {}) {
    super(project, {
      ...simulationCodeProps,
      templateFilename: "norse-master",
    });
  }

  /**
   * Execute simulation code.
   * @remarks It sends request to the backend to execute the code.
   */
  override async exec(): Promise<AxiosResponse<IAxiosResponseData>> {
    this.logger.trace("exec code");

    return norseSimulator.exec(this.script);
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
