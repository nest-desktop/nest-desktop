// simulation.ts

import { AxiosResponse } from "axios";

import { BaseSimulation, ISimulationProps } from "@/helpers/simulation/simulation";
import { IAxiosResponseData } from "@/stores/defineBackendStore";
import { IEventProps } from "@/helpers/activity/activity";

import pynnSimulator from "../../stores/backends/pynnSimulatorStore";
import { PyNNProject } from "../project/project";
import { PyNNSimulationCode } from "./simulationCode";

export class PyNNSimulation extends BaseSimulation {
  constructor(project: PyNNProject, simulationProps: ISimulationProps = {}) {
    super(project, simulationProps);
  }

  override get SimulationCode() {
    return PyNNSimulationCode;
  }

  /**
   * Run simulation.
   *
   * @remarks
   * After the simulation it updates the activities and commits the network.
   */
  override async run(): Promise<AxiosResponse<IAxiosResponseData>> {
    this.logger.trace("run simulation");

    return pynnSimulator
      .simulate({
        source: this.code.script,
        return: "response",
      })
      .then((response: AxiosResponse<IAxiosResponseData>) => {
        if (response.data.data == null) return response;

        let data: {
          events: IEventProps[];
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
