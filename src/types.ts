// types.ts

import { Arc, DragBehavior, Selection, Transition, ZoomBehavior } from "d3";
import { Mesh, MeshBasicMaterial, MeshLambertMaterial } from "three";
import { Store } from "pinia";

import { BaseActivityGraph } from "./helpers/activity/activityGraph";
import { ActivityChartPanelModelParameter } from "./helpers/activityChartGraph/activityChartPanelModelParameter";
import { BaseParameter } from "./helpers/common/parameter";
import { BaseConnection, IConnectionProps } from "./helpers/connection/connection";
import { ConnectionParameter } from "./helpers/connection/connectionParameter";
import { BaseConnections } from "./helpers/connection/connections";
import { BaseModel, IModelProps } from "./helpers/model/model";
import { BaseModelDB } from "./helpers/model/modelDB";
import { ModelParameter } from "./helpers/model/modelParameter";
import { BaseNetwork, INetworkProps } from "./helpers/network/network";
import { BaseNetworkGraph } from "./helpers/networkGraph/networkGraph";
import { BaseNode, INodeProps } from "./helpers/node/node";
import { NodeGroup } from "./helpers/node/nodeGroup";
import { NodeParameter } from "./helpers/node/nodeParameter";
import { BaseNodes } from "./helpers/node/nodes";
import { BaseProject, IProjectProps } from "./helpers/project/project";
import { BaseProjectDB } from "./helpers/project/projectDB";
import { BaseSimulation, ISimulationProps } from "./helpers/simulation/simulation";
import { BaseSimulationCode } from "./helpers/simulation/simulationCode";
import { BaseSynapse, ISynapseProps } from "./helpers/synapse/synapse";
import { BaseSynapseParameter } from "./helpers/synapse/synapseParameter";
//
// Workspaces
//
import * as nest from "./workspaces/nest/types";
import * as norse from "./workspaces/norse/types";
import * as pynn from "./workspaces/pynn/types";

export type TActivityGraph = BaseActivityGraph | nest.NESTActivityGraph;
export type TConnection = BaseConnection | nest.NESTConnection | norse.NorseConnection;
export type TConnectionProps = IConnectionProps | nest.INESTConnectionProps | norse.INorseConnectionProps;
export type TConnections = BaseConnections | nest.NESTConnections | norse.NorseConnections;
export type TModel = BaseModel | nest.NESTModel | norse.NorseModel | pynn.PyNNModel;
export type TModelParameter = ModelParameter | nest.NESTCopyModelParameter;
export type TModelDB = BaseModelDB | nest.NESTModelDB | norse.NorseModelDB | pynn.PyNNModelDB;
export type TModelProps = IModelProps | nest.INESTModelProps | norse.INorseModelProps | pynn.IPyNNModelProps;
export type TNetwork = BaseNetwork | nest.NESTNetwork | norse.NorseNetwork;
export type TNetworkProps = INetworkProps | nest.INESTNetworkProps | norse.INorseNetworkProps;
export type TNetworkGraph = BaseNetworkGraph | nest.NESTNetworkGraph;
export type TNode = BaseNode | nest.NESTNode | norse.NorseNode;
export type TNodeGroup = NodeGroup;
export type TNodeParameterParent =
  | BaseNode
  | nest.NESTNode
  | nest.NESTCopyModel
  | nest.NESTNodeCompartment
  | nest.NESTNodeReceptor
  | norse.NorseNode;
export type TNodeParameterComponentProps =
  | INodeProps
  | nest.INESTNodeProps
  | nest.INESTCopyModelProps
  | nest.INESTNodeCompartmentProps
  | nest.INESTNodeReceptorProps;
export type TNodeProps = INodeProps | nest.INESTNodeProps;
export type TNodes = BaseNodes | nest.NESTNodes | norse.NorseNodes;
export type TParameter =
  | ActivityChartPanelModelParameter
  | ConnectionParameter
  | NodeParameter
  | BaseParameter
  | TModelParameter
  | TSynapseParameter;
export type TProject = BaseProject | nest.NESTProject | norse.NorseProject | pynn.PyNNProject;
export type TProjectDB = BaseProjectDB | nest.NESTProjectDB | norse.NorseProjectDB | pynn.PyNNProjectDB;
export type TProjectProps = IProjectProps | nest.INESTProjectProps | norse.INorseProjectProps | pynn.IPyNNProjectProps;
export type TSimulation = BaseSimulation | nest.NESTSimulation | norse.NorseSimulation | pynn.PyNNSimulation;
export type TSimulationCode =
  | BaseSimulationCode
  | nest.NESTSimulationCode
  | norse.NorseSimulationCode
  | pynn.PyNNSimulationCode;
export type TSimulationProps = ISimulationProps | nest.INESTSimulationProps | norse.INorseSimulationProps;
export type TSynapse = BaseSynapse | nest.NESTSynapse;
export type TSynapseParameter = BaseSynapseParameter | nest.NESTSynapseParameter;
export type TSynapseProps = ISynapseProps | nest.INESTSynapseProps;

// Pinia
export type Class<T> = new (...props: any) => T;
export type TStore = Store<string, any>;

// D3
export type TArc = Arc<any, any>;
export type TDragBehavior = DragBehavior<any, any, any>;
export type TSelection = Selection<any, any, any, any>;
export type TTransition = Transition<any, any, null, undefined>;
export type TZoomBehavior = ZoomBehavior<any, any>;

export type TMesh = Mesh<any, MeshBasicMaterial | MeshLambertMaterial, any>;

export type TValue = any;
