// simulationCode.ts

import {
  BaseSimulationCode,
  ISimulationCodeProps,
} from "@/helpers/simulation/simulationCode";
import { NorseSimulation } from "./simulation";

export interface INorseSimulationCodeProps extends ISimulationCodeProps {}

const simulationCodeBlocks: string[] = [
  "importModules",
  "createNodes",
  "connectNodes",
  "runSimulation",
];

export class NorseSimulationCode extends BaseSimulationCode {
  constructor(
    simulation: NorseSimulation,
    simulationCodeProps: INorseSimulationCodeProps = {}
  ) {
    super(simulation, {
      blocks: simulationCodeBlocks,
      ...simulationCodeProps,
      templateFilename: "norse-master",
    });
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
