// simulationTypes.ts

import { BaseSimulation } from "@/components/simulation/baseSimulation";
import { NESTSimulation } from "@nest/components/simulation/nestSimulation";
import { NorseSimulation } from "@norse/components/simulation/norseSimulation";

export type Simulation = BaseSimulation | NESTSimulation | NorseSimulation;

// for simulation button
export const SimulationPropTypes = [
  BaseSimulation,
  NESTSimulation,
  NorseSimulation,
];
