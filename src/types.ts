// types.ts

import type { Arc, DragBehavior, Selection, Transition, ZoomBehavior } from "d3";
import type { Mesh, MeshBasicMaterial, MeshLambertMaterial } from "three";
import type { Store } from "pinia";

import type {
  BaseConnection,
  BaseConnections,
  BaseNetwork,
  BaseNetworkGraph,
  BaseNode,
  BaseNodes,
  BaseSynapse,
  BaseSynapseParameter,
  ConnectionParameter,
  IConnectionProps,
  INetworkProjectProps,
  INetworkProps,
  INodeProps,
  ISynapseProps,
  NetworkProject,
  NodeRecord,
  NodeGroup,
  NodeParameter,
} from "./networkGraph";

import type { ActivityChartPanelModelParameter } from "./activityGraph/activityChartPanelModelParameter";
import type { BaseActivityGraph } from "./activityGraph/helpers/activityGraph";

import type { BaseModel, IModelProps } from "./helpers/model/model";
import type { BaseModelDB } from "./helpers/model/modelDB";
import type { BaseParameter } from "./helpers/common/parameter";
import type { BaseProject, IBaseProjectProps } from "./helpers/project/project";
import type { BaseProjectDB } from "./helpers/project/projectDB";
import type { BaseSimulation, ISimulationProps } from "./helpers/simulation/simulation";
import type { ModelParameter } from "./helpers/model/modelParameter";

import type * as workspaces from "./workspaces/types";

export type TActivityGraph = BaseActivityGraph | workspaces.TActivityGraph;
// export type TCode = BaseCode | TSimulationCode;
export type TConnection = BaseConnection | workspaces.TConnection;
export type TConnectionProps = IConnectionProps | workspaces.TConnectionProps;
export type TConnections = BaseConnections | workspaces.TConnections;
export type TModel = BaseModel | workspaces.TModel;
export type TModelParameter = ModelParameter | workspaces.TModelParameter;
export type TModelDB = BaseModelDB | workspaces.TModelDB;
export type TModelProps = IModelProps | workspaces.TModelProps;
export type TNetwork = BaseNetwork | workspaces.TNetwork;
export type TNetworkGraph = BaseNetworkGraph | workspaces.TNetworkGraph;
export type TNetworkProject = NetworkProject | workspaces.TNetworkProject;
export type TNetworkProps = INetworkProps | workspaces.TNetworkProps;
export type TNode = BaseNode | workspaces.TNode;
export type TNodeGroup = NodeGroup;
export type TNodeParameterParent = BaseNode | workspaces.TNodeParameterParent;
export type TNodeParameterComponentProps = INodeProps | workspaces.TNodeParameterComponentProps;
export type TNodeProps = INodeProps | workspaces.TNodeProps;
export type TNodeRecord = NodeRecord;
export type TNodes = BaseNodes | workspaces.TNodes;
export type TParameter =
  | ActivityChartPanelModelParameter
  | ConnectionParameter
  | NodeParameter
  | BaseParameter
  | TModelParameter
  | TSynapseParameter;
export type TProject = BaseProject | TNetworkProject;
export type TProjectDB = BaseProjectDB | workspaces.TProjectDB;
export type TProjectProps = IBaseProjectProps | INetworkProjectProps | workspaces.TProjectProps;
export type TSimulation = BaseSimulation | workspaces.TSimulation;
// export type TSimulationCode = workspaces.TSimulationCode;
export type TSimulationProps = ISimulationProps | workspaces.TSimulationProps;
export type TSynapse = BaseSynapse | workspaces.TSynapse;
export type TSynapseParameter = BaseSynapseParameter | workspaces.TSynapseParameter;
export type TSynapseProps = ISynapseProps | workspaces.TSynapseProps;

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
