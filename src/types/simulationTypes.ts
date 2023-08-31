// simulationTypes.ts

import { BaseSimulation } from "@/common/simulation/baseSimulation";
import { NorseSimulation } from "@norse/components/simulation/norseSimulation";

export type Simulation = BaseSimulation | NorseSimulation;
export const SimulationPropTypes = [BaseSimulation, NorseSimulation];
