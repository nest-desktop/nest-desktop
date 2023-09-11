// simulationCode.ts

import {
  BaseSimulationCode,
  SimulationCodeProps,
} from "@/helpers/simulation/simulationCode";
import { Simulation } from "@/types/simulationTypes";

export interface PyNNSimulationCodeProps extends SimulationCodeProps {}

const simulationCodeBlocks: string[] = [
  "importModules",
  "createNodes",
  "connectNodes",
  "runSimulation",
];

export class PyNNSimulationCode extends BaseSimulationCode {
  constructor(
    simulation: Simulation,
    simulationCode: PyNNSimulationCodeProps = {}
  ) {
    simulationCode.blocks = simulationCode?.blocks || simulationCodeBlocks;
    simulationCode.templateFilename = "pynn-master";
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
