// simulationCodeTypes.ts

import { BaseSimulationCode } from "@/helpers/simulation/baseSimulationCode";
import { NESTSimulationCode } from "@/simulators/nest/helpers/simulation/nestSimulationCode";
import { NorseSimulationCode } from "@/simulators/norse/helpers/simulation/norseSimulationCode";

export type SimulationCode = BaseSimulationCode | NESTSimulationCode | NorseSimulationCode;