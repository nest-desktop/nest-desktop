// simulationTypes.ts

import { BaseSimulation } from "@/helpers/simulation/simulation";
import { NESTSimulation } from "@/simulators/nest/helpers/simulation/simulation";
import { NorseSimulation } from "@/simulators/norse/helpers/simulation/simulation";
import { PyNNSimulation } from "@/simulators/pynn/helpers/simulation/simulation";

export type Simulation =
  | BaseSimulation
  | NESTSimulation
  | NorseSimulation
  | PyNNSimulation;

// for simulation button
export const SimulationPropTypes = [
  BaseSimulation,
  NESTSimulation,
  NorseSimulation,
  PyNNSimulation,
];
