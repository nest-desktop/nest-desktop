// simulationCodeTypes.ts

import { BaseSimulationCode } from "@/helpers/simulation/simulationCode";
import { NESTSimulationCode } from "@/simulators/nest/helpers/simulation/simulationCode";
import { NorseSimulationCode } from "@/simulators/norse/helpers/simulation/simulationCode";
import { PyNNSimulationCode } from "@/simulators/pynn/helpers/simulation/simulationCode";

export type SimulationCode =
  | BaseSimulationCode
  | NESTSimulationCode
  | NorseSimulationCode
  | PyNNSimulationCode;
