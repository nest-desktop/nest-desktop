// simulation.ts

import { BaseSimulation, type ISimulationState } from "@/helpers/simulation/simulation";

import { NorseProject } from "../project/project";

export interface INorseSimulationState extends ISimulationState {
  seed?: number;
}

export class NorseSimulation extends BaseSimulation {
  private _seed: number;

  constructor(project: NorseProject, simulationState: INorseSimulationState = {}) {
    super(project, simulationState);

    this._seed = simulationState.seed || 0;
  }

  get seed(): number {
    return this._seed;
  }
}
