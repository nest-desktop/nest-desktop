// simulation.ts

import {
  BaseSimulation,
  ISimulationProps,
} from "@/helpers/simulation/simulation";
import { openToast } from "@/helpers/common/toast";

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
  override async run(): Promise<any> {
    this.logger.trace("run simulation");

    const pynnSimulatorStore = usePyNNSimulatorStore();
    return pynnSimulatorStore
      .axiosInstance()
      .post("exec", {
        source: this.code.script,
        return: "response",
      })
      .then((response: any) => {
        let data: any;
        switch (response.status) {
          case 0:
            openToast("Failed to find PyNN Simulator.", { type: "error" });
            break;
          case 200:
            if (response.data.data == null) {
              break;
            }
            data = response.data.data;

            // Get biological time
            this.state.biologicalTime =
              data.biological_time != null ? data.biological_time : this.time;

            break;
          default:
            openToast(response.data, { type: "error" });
            break;
        }

        return response;
      });
  }
}
