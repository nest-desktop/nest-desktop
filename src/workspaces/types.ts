// types.ts

import * as nest from "./nest/types";
import * as norse from "./norse/types";
import * as pynn from "./pynn/types";

export type TActivityGraph = nest.NESTActivityGraph;
export type TConnection = nest.NESTConnection | norse.NorseConnection;
export type TConnectionState = nest.INESTConnectionState | norse.INorseConnectionState;
export type TConnections = nest.NESTConnections | norse.NorseConnections;
export type TModel = nest.NESTModel | norse.NorseModel | pynn.PyNNModel;
export type TModelParameter = nest.NESTCopyModelParameter;
export type TModelDB = nest.NESTModelDB | norse.NorseModelDB | pynn.PyNNModelDB;
export type TModelState = nest.INESTModelState | norse.INorseModelState | pynn.IPyNNModelState;
export type TNetwork = nest.NESTNetwork | norse.NorseNetwork;
export type TNetworkGraph = nest.NESTNetworkGraph;
export type TNetworkProject = nest.NESTProject | norse.NorseProject | pynn.PyNNProject;
export type TNetworkState = nest.INESTNetworkState | norse.INorseNetworkState;
export type TNode = nest.NESTNode | norse.NorseNode;
export type TNodeParameterParent =
  | nest.NESTNode
  | nest.NESTCopyModel
  | nest.NESTNodeCompartment
  | nest.NESTNodeReceptor
  | norse.NorseNode;
export type TNodeParameterComponentState =
  | nest.INESTNodeState
  | nest.INESTCopyModelState
  | nest.INESTNodeCompartmentState
  | nest.INESTNodeReceptorState;
export type TNodeState = nest.INESTNodeState;
export type TNodes = nest.NESTNodes | norse.NorseNodes;
export type TProjectDB = nest.NESTProjectDB | norse.NorseProjectDB | pynn.PyNNProjectDB;
export type TProjectState = nest.INESTProjectState | norse.INorseProjectState | pynn.IPyNNProjectState;
export type TSimulation = nest.NESTSimulation | norse.NorseSimulation | pynn.PyNNSimulation;
// export type TSimulationCode = nest.NESTSimulationCode | norse.NorseSimulationCode | pynn.PyNNSimulationCode;
export type TSimulationState = nest.INESTSimulationState | norse.INorseSimulationState;
export type TSynapse = nest.NESTSynapse;
export type TSynapseParameter = nest.NESTSynapseParameter;
export type TSynapseState = nest.INESTSynapseState;
