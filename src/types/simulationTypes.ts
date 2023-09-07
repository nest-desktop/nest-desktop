// simulationTypes.ts

import { BaseSimulation } from "@/helpers/simulation/baseSimulation";
import { NESTSimulation } from "@nest/helpers/simulation/nestSimulation";
import { NorseSimulation } from "@norse/helpers/simulation/norseSimulation";

export type Simulation = BaseSimulation | NESTSimulation | NorseSimulation;

// for simulation button
export const SimulationPropTypes = [
  BaseSimulation,
  NESTSimulation,
  NorseSimulation,
];
