// simulationTypes.ts

import { BaseSimulation } from "@/helpers/simulation/simulation";
import { NESTSimulation } from "@/simulators/nest/helpers/simulation/simulation";
import { NorseSimulation } from "@/simulators/norse/helpers/simulation/simulation";
import { PyNNSimulation } from "@/simulators/pynn/helpers/simulation/simulation";

export type TSimulation =
  | BaseSimulation
  | NESTSimulation
  | NorseSimulation
  | PyNNSimulation;

// for components
export const TSimulationProps = [
  BaseSimulation,
  NESTSimulation,
  NorseSimulation,
  PyNNSimulation,
];
