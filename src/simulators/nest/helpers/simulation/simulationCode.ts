// simulationCode.ts

import { BaseSimulationCode, ISimulationCodeProps } from "@/helpers/simulation/simulationCode";

import { NESTSimulation } from "./simulation";

const simulationCodeBlocks: string[] = [
  "importModules",
  "resetKernel",
  "setKernel",
  "createNodes",
  "connectNodes",
  "runSimulation",
];

export class NESTSimulationCode extends BaseSimulationCode {
  constructor(simulation: NESTSimulation, simulationCodeProps: ISimulationCodeProps = {}) {
    super(simulation, {
      blocks: simulationCodeBlocks,
      templateFilename: "nest-master",
      ...simulationCodeProps,
    });
  }

  get runSimulationInsite(): boolean {
    return false;
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
