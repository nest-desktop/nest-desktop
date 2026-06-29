// simulation.ts

import { BaseSimulation, type ISimulationState } from "@/simulation";

import { NorseProject } from "../project";

export interface INorseSimulationState extends ISimulationState {
  seed?: number;
}

export class NorseSimulation extends BaseSimulation<NorseProject> {
  private _seed: number = 0;

  constructor(project: NorseProject) {
    super(project);
  }

  get seed(): number {
    return this._seed;
  }
}
