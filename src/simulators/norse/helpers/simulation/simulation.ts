// simulation.ts

import { AxiosResponse } from "axios";

import {
  BaseSimulation,
  ISimulationProps,
} from "@/helpers/simulation/simulation";

import norseSimulator from "../../stores/backends/norseSimulatorStore";
import { NorseProject } from "../project/project";
import { NorseSimulationCode } from "./simulationCode";

export interface INorseSimulationProps extends ISimulationProps {}

export class NorseSimulation extends BaseSimulation {
  constructor(
    project: NorseProject,
    simulationProps: INorseSimulationProps = {}
  ) {
    super(project, simulationProps);
  }

  override get SimulationCode() {
    return NorseSimulationCode;
  }

  /**
   * Run simulation.
   *
   * @remarks
   * After the simulation it updates the activities and commits the network.
   */
  override async run(): Promise<AxiosResponse<any, { data: any }>> {
    this.logger.trace("run simulation");

    return norseSimulator
      .simulate({
        source: this.code.script,
        return: "response",
      })
      .then((response: AxiosResponse<any, { data: any; status: number }>) => {
        if (response.data.data == null) {
          return response;
        }

        let data: {
          events: any[];
          biological_time: number;
        };
        switch (response.status) {
          case 200:
            data = response.data.data;

            // Get biological time
            this.state.biologicalTime = data.biological_time || this.time;

            break;
        }

        return response;
      });
  }
}
