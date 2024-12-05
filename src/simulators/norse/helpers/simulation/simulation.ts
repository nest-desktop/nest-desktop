// simulation.ts

import { AxiosResponse } from "axios";

import { BaseSimulation, ISimulationProps } from "@/helpers/simulation/simulation";
import { IAxiosResponseData } from "@/stores/defineBackendStore";
import { IEventProps } from "@/helpers/activity/activity";

import norseSimulator from "../../stores/backends/norseSimulatorStore";
import { NorseProject } from "../project/project";
import { NorseSimulationCode } from "./simulationCode";

export interface INorseSimulationProps extends ISimulationProps {
  seed?: number;
}

export class NorseSimulation extends BaseSimulation {
  private _seed: number;

  constructor(project: NorseProject, simulationProps: INorseSimulationProps = {}) {
    super(project, simulationProps);

    this._seed = simulationProps.seed || 0;
  }

  get seed(): number {
    return this._seed;
  }

  override get SimulationCode() {
    return NorseSimulationCode;
  }

  /**
   * Run simulation.
   * @remarks After the simulation it updates the activities and commits the network.
   */
  override async run(): Promise<void | AxiosResponse<IAxiosResponseData>> {
    this.logger.trace("run simulation");

    return norseSimulator
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
