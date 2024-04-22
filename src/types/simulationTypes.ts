// simulationTypes.ts

import {
  BaseSimulation,
  ISimulationProps,
} from "@/helpers/simulation/simulation";
import {
  INESTSimulationProps,
  NESTSimulation,
} from "@/simulators/nest/helpers/simulation/simulation";
import {
  INorseSimulationProps,
  NorseSimulation,
} from "@/simulators/norse/helpers/simulation/simulation";
import {
  IPyNNSimulationProps,
  PyNNSimulation,
} from "@/simulators/pynn/helpers/simulation/simulation";

export type TSimulation =
  | BaseSimulation
  | NESTSimulation
  | NorseSimulation
  | PyNNSimulation;

export type TSimulationProps =
  | ISimulationProps
  | INESTSimulationProps
  | INorseSimulationProps
  | IPyNNSimulationProps;
