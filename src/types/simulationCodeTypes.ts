// simulationCodeTypes.ts

import { BaseSimulationCode } from "@/common/simulation/baseSimulationCode";
import { NorseSimulationCode } from "@norse/components/simulation/norseSimulationCode";

export type SimulationCode = BaseSimulationCode | NorseSimulationCode;