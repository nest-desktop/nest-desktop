// simulation.ts

import { AxiosResponse } from "axios";

import {
  BaseSimulation,
  ISimulationProps,
} from "@/helpers/simulation/simulation";

import { PyNNProject } from "../project/project";
import { PyNNSimulationCode } from "./simulationCode";
import { usePyNNSimulatorStore } from "../../stores/backends/pynnSimulatorStore";

export interface IPyNNSimulationProps extends ISimulationProps {}

export class PyNNSimulation extends BaseSimulation {
  constructor(
    project: PyNNProject,
    simulationProps: IPyNNSimulationProps = {}
  ) {
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
  override async run(): Promise<AxiosResponse<any, { data: any }>> {
    this.logger.trace("run simulation");

    const pynnSimulatorStore = usePyNNSimulatorStore();
    return pynnSimulatorStore
      .axiosInstance()
      .post("exec", {
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
