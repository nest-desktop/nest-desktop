// code.ts

import { AxiosResponse } from "axios";

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { BaseCode } from "@/helpers/code/code";
import { IAxiosResponseData } from "@/stores/defineBackendStore";

import norse from "../../stores/backends/norseSimulatorStore";
import norseDataResponse from "../codeNodeTypes/norse/norseDataResponse";
import { INorseNetworkProps } from "../network/network";
import { NorseProject } from "../project/project";

export class NorseCode extends BaseCode {
  constructor(project: NorseProject) {
    super(project);
  }

  override get project(): NorseProject {
    return this._project as NorseProject;
  }

  /**
   * Add code nodes.
   */
  addBaseCodeNodes(): void {
    this.logger.trace("add base code nodes");
    this.graph.unsubscribe();
    const left = 300;
    const width = 350;
    const space = 70;
    let codeNode: AbstractCodeNode;

    // response
    codeNode = this.graph.addNodeWithCoordinates(norseDataResponse, left + 2 * (width + space), 600);
    codeNode.state.role = "last";
    this.graph.subscribe();
  }

  /**
   * Add code nodes from network props.
   */
  addNetworkCodeNodes(networkProps: INorseNetworkProps): void {
    this.logger.trace("add network code nodes");
    this.graph.unsubscribe();

    const left = 300;
    const width = 350;
    const space = 70;

    const nodes: AbstractCodeNode[] = [];

    this.graph.subscribe();
  }

  /**
   * Execute simulation code.
   * @remarks It sends request to the backend to execute the code.
   */
  override async exec(): Promise<AxiosResponse<IAxiosResponseData>> {
    this.logger.trace("exec code");

    return norse.exec(this.script);
  }

  override initGraph(): void {
    this.logger.trace("init graph");
    const projectProps = this.project.toJSON();

    this.graph.unsubscribe();
    this.graph.init();
    this.graph.clear();
    this.graph.subscribe();

    this.addBaseCodeNodes();
    this.addNetworkCodeNodes(projectProps.network as INorseNetworkProps);
    // this.sortNodes();

    this.graph.onUpdate();
  }

  /**
   * Update code graph from network props.
   */
  updateCodeGraph(): void {
    this.logger.trace("update graph from network");
    const left = 300;
    const width = 350;
    const space = 70;
    let codeNode: AbstractCodeNode;
    const nodes: AbstractCodeNode[] = [];

    // response
    const responseNode = this.graph.addNodeWithCoordinates(response, left + 2 * (width + space), 600);
    if (nodes.length > 0) {
      // nodes
      //   .filter((node: AbstractCodeNode) => node.outputs.events)
      //   .forEach((node: AbstractCodeNode) => {
      //     this.graph.addConnection(node.outputs.events, responseNode.inputs.events);
      //   });
    }

    this.graph.save();
  }
}
