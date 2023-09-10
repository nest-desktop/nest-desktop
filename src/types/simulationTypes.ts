// simulationTypes.ts

import { BaseSimulation } from "@/helpers/simulation/baseSimulation";
import { NESTSimulation } from "@/simulators/nest/helpers/simulation/nestSimulation";
import { NorseSimulation } from "@/simulators/norse/helpers/simulation/norseSimulation";

export type Simulation = BaseSimulation | NESTSimulation | NorseSimulation;

// for simulation button
export const SimulationPropTypes = [
  BaseSimulation,
  NESTSimulation,
  NorseSimulation,
];
