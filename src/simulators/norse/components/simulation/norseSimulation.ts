// norseSimulation.ts

import {
  BaseSimulation,
  SimulationProps,
} from "@/components/simulation/baseSimulation";
import { SimulationCodeProps } from "@/components/simulation/baseSimulationCode";
import { openToast } from "@/helpers/toast";

import { NorseProject } from "../project/norseProject";
import { useNorseSimulatorStore } from "@norse/store/backends/norseSimulatorStore";

import { NorseSimulationCode } from "./norseSimulationCode";

export interface NorseSimulationProps extends SimulationProps {}

export class NorseSimulation extends BaseSimulation {
  constructor(project: NorseProject, simulation: NorseSimulationProps = {}) {
    super(project, simulation, "NorseSimulation");
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
