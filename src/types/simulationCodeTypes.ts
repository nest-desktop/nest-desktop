// simulationCodeTypes.ts

import { BaseSimulationCode } from "@/components/simulation/baseSimulationCode";
import { NESTSimulationCode } from "@nest/components/simulation/nestSimulationCode";
import { NorseSimulationCode } from "@norse/components/simulation/norseSimulationCode";

export type SimulationCode = BaseSimulationCode | NESTSimulationCode | NorseSimulationCode;