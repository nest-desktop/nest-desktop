// norseSimulationCode.ts

import { Simulation } from "@/types/simulationTypes";
import {
  BaseSimulationCode,
  SimulationCodeProps,
} from "@/common/simulation/baseSimulationCode";

const simulationCodeBlocks: string[] = [
  "importModules",
  "createNodes",
  "connectNodes",
  "runSimulation",
];

export class NorseSimulationCode extends BaseSimulationCode {
  constructor(
    simulation: Simulation,
    simulationCode: SimulationCodeProps = {}
  ) {
    simulationCode.blocks = simulationCode?.blocks || simulationCodeBlocks;
    simulationCode.templateFilename = "norse-master";
    super(simulation, simulationCode);
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
