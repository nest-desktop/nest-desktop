// simulationCode.ts

import Mustache from "mustache";
import { AxiosError, AxiosResponse } from "axios";

import { IAxiosErrorData, IAxiosResponseData } from "@/stores/defineBackendStore";
import { TNetworkProject } from "@/types";

import { BaseCode, ICodeProps } from "../code/code";
import { notifyError, notifySuccess } from "../common/notification";

export class SimulationCode extends BaseCode {
  constructor(project: TNetworkProject, codeProps?: ICodeProps) {
    super(project, { templateFilename: "simulation-code", ...codeProps });
  }

  get project(): TNetworkProject {
    return this._project as TNetworkProject;
  }

  override renderCode(): void {
    this.script = Mustache.render(this.state.template || "", this.project);
  }

  /**
   * Run simulation.
   * @remarks After the simulation it updates the biological time of the simulation.
   */
  async runSimulation(): Promise<void | AxiosResponse<IAxiosResponseData>> {
    this.logger.trace("run simulation");

    this.resetErrorState();

    return this.exec()
      .then((response: AxiosResponse<IAxiosResponseData>) => {
        switch (response.status) {
          case 0:
            notifyError("Failed to find Simulator.");
            break;
          case 200:
            notifySuccess("Simulation finished.");
            break;
          case 400:
            if (typeof response.data === "string") {
              notifyError(response.data);
            }
            break;
          default:
            break;
        }
        return response;
      })
      .catch((error: AxiosError<IAxiosErrorData | string>) => {
        if ("response" in error && error.response?.data != undefined) {
          // The request made and the server responded.
          const responseData = error.response.data;
          if (typeof responseData === "string") {
            notifyError(responseData);
            this.state.error.message = responseData as string;
          } else if ("message" in responseData) {
            notifyError(responseData.message as string);
            this.state.error = responseData;
          }
        } else if ("request" in error) {
          // The request was made but no response was received.
          notifyError("Failed to perform simulation (Simulator backend is not running).");
        } else if ("message" in error && error.message != undefined) {
          // Something happened in setting up the request
          // that triggered an error.
          notifyError(error.message);
        }
      });
  }
}
