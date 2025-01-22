// simulationCode.ts

import { AxiosResponse } from "axios";

import { ICodeProps } from "@/helpers/code/code";
import { SimulationCode } from "@/helpers/simulation/simulationCode";
import { IAxiosResponseData } from "@/stores/defineBackendStore";

import nest from "../../stores/backends/nestSimulatorStore";
import { NESTProject } from "../project/project";

export class NESTSimulationCode extends SimulationCode {
  constructor(project: NESTProject, simulationCodeProps: ICodeProps = {}) {
    super(project, {
      templateFilename: "nest-master",
      ...simulationCodeProps,
    });
  }

  get project(): NESTProject {
    return this._project as NESTProject;
  }

  /**
   * Execute simulation code with or without insite.
   * @remarks It sends request to the backend to execute the code.
   */
  override async exec(): Promise<AxiosResponse<IAxiosResponseData>> {
    this.logger.trace("exec code");

    // return this.doRunSimulationInsite ? this.execWithInsite() : nest.exec(this.script);
    return nest.exec(this.script);
  }

  // /**
  //  * Run simulation with recording backend Insite.
  //  * @remarks During the simulation it gets and updates activities.
  //  */
  // private async execWithInsite(): Promise<void | AxiosResponse<IAxiosResponseData>> {
  //   this.logger.trace("run simulation with Insite");

  //   this.project.simulation.state.timeInfo = {
  //     begin: 0,
  //     current: 0,
  //     end: 0,
  //     stepSize: 1,
  //   };

  //   return nest
  //     .exec(this.script, "")
  //     .then((response: AxiosResponse<IAxiosResponseData>) => {
  //       switch (response.status) {
  //         case 200:
  //           if (this.runSimulation) {
  //             this.project.insite.simulationEndNotification();
  //           }
  //           break;
  //         default:
  //           notifyError("Failed to find NEST simulation instance.");
  //           this.project.insite.cancelAllIntervals();
  //           break;
  //       }
  //       return response;
  //     })
  //     .catch((error: AxiosError<IAxiosErrorData | string>) => {
  //       this.project.insite.cancelAllIntervals();
  //       if ("response" in error && error.response?.data != undefined) notifyError(error.response.data as string);
  //     });
  // }

  /**
   * Import template from the file.
   * @return Promise of dict
   */
  override async importTemplate(): Promise<{ default: string }> {
    this.logger.trace("import template:", this.state.templateFilename);

    return import(`./templates/${this.state.templateFilename}.mustache?raw`);
  }
}
