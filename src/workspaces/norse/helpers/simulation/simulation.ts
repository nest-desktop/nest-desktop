// simulation.ts

import { BaseSimulation, type ISimulationProps } from "@/helpers/simulation/simulation";

import { NorseProject } from "../project/project";

export interface INorseSimulationProps extends ISimulationProps {
  seed?: number;
}

export class NorseSimulation extends BaseSimulation {
  private _seed: number;

  constructor(project: NorseProject, simulationProps: INorseSimulationProps = {}) {
    super(project, simulationProps);

    this._seed = simulationProps.seed || 0;
  }

  get seed(): number {
    return this._seed;
  }
}
