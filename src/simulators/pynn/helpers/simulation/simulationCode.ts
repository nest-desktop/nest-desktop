// simulationCode.ts

import {
  BaseSimulationCode,
  ISimulationCodeProps,
} from "@/helpers/simulation/simulationCode";

import { PyNNSimulation } from "./simulation";

export interface IPyNNSimulationCodeProps extends ISimulationCodeProps {}

const simulationCodeBlocks: string[] = [
  "importModules",
  "createNodes",
  "connectNodes",
  "runSimulation",
];

export class PyNNSimulationCode extends BaseSimulationCode {
  constructor(
    simulation: PyNNSimulation,
    simulationCodeProps: IPyNNSimulationCodeProps = {}
  ) {
    simulationCodeProps.templateFilename = "pynn-master";
    super(simulation, {
      blocks: simulationCodeBlocks,
      ...simulationCodeProps,
      templateFilename: "pynn-master",
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
