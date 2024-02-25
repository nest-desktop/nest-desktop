// simulationCode.ts

import {
  BaseSimulationCode,
  SimulationCodeProps,
} from "@/helpers/simulation/simulationCode";
import { Simulation } from "@/types/simulationTypes";

export interface NESTSimulationCodeProps extends SimulationCodeProps {}

const simulationCodeBlocks: string[] = [
  "importModules",
  "resetKernel",
  "setKernel",
  "createNodes",
  "connectNodes",
  "runSimulation",
];

export class NESTSimulationCode extends BaseSimulationCode {
  constructor(
    simulation: Simulation,
    simulationCode: NESTSimulationCodeProps = {}
  ) {
    simulationCode.blocks = simulationCode?.blocks || simulationCodeBlocks;
    simulationCode.templateFilename = "nest-master";
    super(simulation, simulationCode);
  }

  get runSimulationInsite(): boolean {
    return false;
  }

  /**
   * Import template from the file.
   * @return promise
   */
  override async importTemplate(): Promise<any> {
    this.logger.trace("import template:", this.state.templateFilename);
    return import(`./templates/${this.state.templateFilename}.mustache?raw`);
  }
}
