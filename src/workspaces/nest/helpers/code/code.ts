// code.ts

import { AxiosResponse } from "axios";

import functionNode from "@/helpers/codeNodeTypes/base/function";
import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { BaseCode, ICodeProps } from "@/helpers/code/code";
import { IAxiosResponseData } from "@/stores/defineBackendStore";

import nest from "../../stores/backends/nestSimulatorStore";
import nestDataResponse from "../codeNodeTypes/nest/nestDataResponse";
import nestInstall from "../codeNodeTypes/nest/nestInstall";
import nestResetKernel from "../codeNodeTypes/nest/nestResetKernel";
import nestSetKernelStatus from "../codeNodeTypes/nest/nestSetKernelStatus";
import nestSimulate from "../codeNodeTypes/nest/nestSimulate";
import { INESTNetworkProps } from "../network/network";
import { INESTSimulationProps } from "../simulation/simulation";
import { INESTProjectProps, NESTProject } from "../project/project";
import { connectNodes, copySynapseModels } from "../codeGraph/connections";
import { copyNodeModels, createNodes } from "../codeGraph/nodes";

export class NESTCode extends BaseCode {
  constructor(project: NESTProject, codeProps: ICodeProps) {
    super(project, codeProps);
    this.logger.settings.minLevel = 1;
  }

  override get project(): NESTProject {
    return this._project as NESTProject;
  }

  /**
   * Execute simulation code with or without insite.
   * @remarks It sends request to the backend to execute the code.
   */
  override async exec(): Promise<AxiosResponse<IAxiosResponseData>> {
    this.logger.trace("exec code");

    return nest.exec(this.script);
    // return this.doRunSimulationInsite ? this.execWithInsite() : nest.exec(this.script);
  }

  /**
   * Add code nodes.
   */
  addBaseCodeNodes(): void {
    this.logger.trace("add base code nodes");
    let codeNode: AbstractCodeNode;

    this.graph.unsubscribe();

    // nest.ResetKernel
    codeNode = this.graph.addNodeAtColumn(nestResetKernel, 0, 100);
    codeNode.state.role = "first";

    // response of nest data
    codeNode = this.graph.addNodeAtColumn(nestDataResponse, 3, 600);
    codeNode.state.role = "last";

    this.graph.subscribe();
  }

  /**
   * Initialize code component.
   * @remarks It generates code.
   */
  override init(): void {
    this.logger.trace("init");

    this.graph.init();
    // this.initGraph(this.project.doc);
    this.changes();
  }

  override initGraph(projectProps?: INESTProjectProps): void {
    this.logger.trace("init graph");

    this.graph.clear();
    this.graph.init();

    this.load(projectProps);
    this.graph.onUpdate();
  }

  clearNetworkCodeNodes(): void {
    this.graph.unsubscribe();
    this.graph.nodes
      .filter((node) => node.state.role === "network")
      .forEach((node) => this.graph.graph.removeNode(node));
    this.graph.subscribe();
  }

  load(projectProps?: INESTProjectProps): void {
    this.logger.trace("load");
    if (!projectProps) return;

    this.addBaseCodeNodes();
    if (projectProps.network) this.loadFromNetwork(projectProps.network as INESTNetworkProps);
    if (projectProps.simulation) this.loadFromSimulation(projectProps.simulation as INESTSimulationProps);
    this.graph.onUpdate();
  }

  /**
   * Load code nodes from network props.
   */
  loadFromNetwork(networkProps: INESTNetworkProps): void {
    this.logger.trace("load from network");
    if (!networkProps) return;

    copyNodeModels(this.graph, networkProps.models);
    const nodes = createNodes(this.graph, networkProps.nodes);

    copySynapseModels(this.graph, networkProps.models, nodes.weightRecorders);
    connectNodes(this.graph, networkProps.connections, nodes.all);

    // define function getPos
    if (nodes.spatial.length > 0) {
      const posNode = this.graph.addNodeAtColumn(functionNode, 3, 800);
      posNode.state.role = "network";
      // posNode.inputs.code.value = "def getPos(n): return dict(zip(n.global_id, nest.GetPosition(n)))";
      posNode.inputs.code.value = "getPos = lambda n: dict(zip(n.global_id, nest.GetPosition(n)))";
    }

    // update response
    const responseNode = this.graph.findNodeByType("nest/response");
    console.log(responseNode);
    if (responseNode) {
      if (nodes.all.length > 0) {
        nodes.all
          .filter((node: AbstractCodeNode) => node.outputs.events)
          .forEach((node: AbstractCodeNode) => {
            this.graph.addConnection(node.outputs.events, responseNode.inputs.events);
          });
      }

      if (nodes.spatial.length > 0) {
        nodes.spatial.forEach((spatialNode) => {
          spatialNode.outputs.positions.hidden = false;
          this.graph.addConnection(spatialNode.outputs.positions, responseNode.inputs.positions);
        });
      }
    }

    this.graph.subscribe();
  }

  /**
   * Load code nodes from simulation props.
   */
  loadFromSimulation(simulationProps: INESTSimulationProps): void {
    this.logger.trace("load from simulation");
    let codeNode: AbstractCodeNode;

    this.graph.unsubscribe();

    if (simulationProps?.modules) {
      // nest.Install
      codeNode = this.graph.addNodeAtColumn(nestInstall, 0, 200);
      codeNode.state.role = "before";
    }

    // nest.SetKernelStatus
    codeNode = this.graph.addNodeAtColumn(nestSetKernelStatus, 0, 200);
    codeNode.state.role = "before";
    codeNode.state.comments = "Set simulation kernel";
    if (simulationProps?.kernel) {
      codeNode.inputs.local_num_threads.value = simulationProps.kernel.localNumThreads;
      codeNode.inputs.local_num_threads.hidden = simulationProps.kernel.localNumThreads === 1;
      codeNode.inputs.resolution.value = simulationProps.kernel.resolution;
      codeNode.inputs.resolution.hidden = simulationProps.kernel.resolution === 0.1;
      codeNode.inputs.rng_seed.value = simulationProps.kernel.rngSeed;
      codeNode.inputs.rng_seed.hidden = false;
    }

    // nest.Simulate
    codeNode = this.graph.addNodeAtColumn(nestSimulate, 0, 450);
    codeNode.state.role = "after";
    codeNode.state.comments = "Run simulation";
    codeNode.inputs.time.value = simulationProps?.time ?? 1000;

    this.graph.subscribe();
  }

  updateNetworkCodeNodes(): void {
    this.logger.trace("update network code nodes");
    const projectProps = this.project.doc;

    this.clearNetworkCodeNodes();
    this.loadFromNetwork(projectProps.network as INESTNetworkProps);

    this.graph.onUpdate();
  }

  // /**
  //  * Run simulation with recording backend Insite.
  //  * @remarks During the simulation it gets and updates activities from access node.
  //  */
  // private async execWithInsite(): Promise<AxiosResponse<IAxiosResponseData>> {
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
  //           if (this.doRunSimulation) this.project.insite.simulationEndNotification();

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
}
