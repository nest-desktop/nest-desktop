// simulation.ts

import {
  BaseSimulation,
  SimulationProps,
} from "@/helpers/simulation/simulation";
import { SimulationCodeProps } from "@/helpers/simulation/simulationCode";
import { openToast } from "@/helpers/common/toast";

import { NorseProject } from "../project/project";
import { NorseSimulationCode } from "./simulationCode";
import { useNorseSimulatorStore } from "../../store/backends/norseSimulatorStore";

export interface NorseSimulationProps extends SimulationProps {}

export class NorseSimulation extends BaseSimulation {
  constructor(project: NorseProject, simulation: NorseSimulationProps = {}) {
    super(project, simulation);
  }

  override newSimulationCode(
    simulationCode?: SimulationCodeProps
  ): NorseSimulationCode {
    return new NorseSimulationCode(this, simulationCode);
  }

  /**
   * Run simulation.
   *
   * @remarks
   * After the simulation it updates the activities and commits the network.
   */
  override async run(): Promise<any> {
    this.logger.trace("run simulation");

    const norseSimulatorStore = useNorseSimulatorStore();
    return norseSimulatorStore.instance
      .post("exec", {
        source: this.code.script,
        return: "response",
      })
      .then((response: any) => {
        let data: any;
        switch (response.status) {
          case 0:
            openToast("Failed to find Norse Simulator.", { type: "error" });
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
