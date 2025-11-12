// codeSimulation.ts

import { AxiosError, type AxiosResponse } from "axios";

import type { IAxiosErrorData, IAxiosResponseData } from "@/stores/defineBackendStore";

import { CodeHandler } from "@/codeGraph/codeHandler";
import { notifyError, notifySuccess } from "../common/notification";

export class SimulationHandler extends CodeHandler {
  /**
   * Run simulation.
   */
  async run(script: string): Promise<void | AxiosResponse<IAxiosResponseData>> {
    this.logger.trace("run");

    this.resetErrorState();

    return this.backend
      ?.exec(script)
      .then((response: AxiosResponse<IAxiosResponseData>) => {
        if (!response) return response;

        switch (response.status) {
          case 0:
            notifyError("Failed to find Simulator.");
            break;
          case 200:
            notifySuccess("Simulation finished.");
            break;
          case 400:
            if (typeof response.data === "string") notifyError(response.data);
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
            this.error.message = responseData as string;
          } else if ("message" in responseData) {
            notifyError(responseData.message as string);
            this.error.message = responseData.message;
            this.error.lineNumber = responseData.lineNumber;
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
