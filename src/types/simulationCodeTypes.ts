// simulationCodeTypes.ts

import { BaseSimulationCode } from "@/helpers/simulation/baseSimulationCode";
import { NESTSimulationCode } from "@nest/helpers/simulation/nestSimulationCode";
import { NorseSimulationCode } from "@norse/helpers/simulation/norseSimulationCode";

export type SimulationCode = BaseSimulationCode | NESTSimulationCode | NorseSimulationCode;