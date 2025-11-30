// types.ts

import type { Arc, DragBehavior, Selection, Transition, ZoomBehavior } from "d3";
import type { Mesh, MeshBasicMaterial, MeshLambertMaterial } from "three";
import type { Store } from "pinia";

import type {
  BaseConnection,
  BaseConnections,
  BaseNetwork,
  BaseNode,
  BaseNodes,
  BaseSynapse,
  BaseSynapseParameter,
  ConnectionParameter,
  IConnectionState,
  INetworkState,
  INodeState,
  ISynapseState,
  NodeGroup,
  NodeParameter,
  NodeRecord,
} from "./network";

import { BaseNetworkGraph } from "./networkGraph";

import type { ActivityChartPanelModelParameter, BaseActivityGraph } from "./activityGraph";

import type { BaseModel, IModelState } from "./model";
import type { BaseModelDB } from "./model";
import type { BaseParameter } from "./parameter";
import type { BaseProject, INetworkProjectState, IProjectState, NetworkProject } from "./project";
import type { BaseProjectDB } from "./project";
import type { BaseSimulation, ISimulationState } from "./simulation";
import type { ModelParameter } from "./model";

import type * as workspaces from "./workspaces/types";

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

//
export type TActivityGraph = BaseActivityGraph | workspaces.TActivityGraph;
export type TConnection = BaseConnection | workspaces.TConnection;
export type TConnectionState = IConnectionState | workspaces.TConnectionState;
export type TConnections = BaseConnections | workspaces.TConnections;
export type TModel = BaseModel | workspaces.TModel;
export type TModelParameter = ModelParameter | workspaces.TModelParameter;
export type TModelDB = BaseModelDB | workspaces.TModelDB;
export type TModelState = IModelState | workspaces.TModelState;
export type TNetwork = BaseNetwork | workspaces.TNetwork;
export type TNetworkGraph = BaseNetworkGraph | workspaces.TNetworkGraph;
export type TNetworkProject = NetworkProject | workspaces.TNetworkProject;
export type TNetworkState = INetworkState | workspaces.TNetworkState;
export type TNode = BaseNode | workspaces.TNode;
export type TNodeGroup = NodeGroup;
export type TNodeParameterParent = BaseNode | workspaces.TNodeParameterParent;
export type TNodeParameterComponentState = INodeState | workspaces.TNodeParameterComponentState;
export type TNodeState = INodeState | workspaces.TNodeState;
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
export type TProjectState = IProjectState | INetworkProjectState | workspaces.TProjectState;
export type TSimulation = BaseSimulation | workspaces.TSimulation;
export type TSimulationState = ISimulationState | workspaces.TSimulationState;
export type TSynapse = BaseSynapse | workspaces.TSynapse;
export type TSynapseParameter = BaseSynapseParameter | workspaces.TSynapseParameter;
export type TSynapseState = ISynapseState | workspaces.TSynapseState;
