// types.ts

import * as nest from "./nest/types";
import * as norse from "./norse/types";
import * as pynn from "./pynn/types";

export type TActivityGraph = nest.NESTActivityGraph;
export type TConnection = nest.NESTConnection | norse.NorseConnection;
export type TConnectionProps = nest.INESTConnectionProps | norse.INorseConnectionProps;
export type TConnections = nest.NESTConnections | norse.NorseConnections;
export type TModel = nest.NESTModel | norse.NorseModel | pynn.PyNNModel;
export type TModelParameter = nest.NESTCopyModelParameter;
export type TModelDB = nest.NESTModelDB | norse.NorseModelDB | pynn.PyNNModelDB;
export type TModelProps = nest.INESTModelProps | norse.INorseModelProps | pynn.IPyNNModelProps;
export type TNetwork = nest.NESTNetwork | norse.NorseNetwork;
export type TNetworkGraph = nest.NESTNetworkGraph;
export type TNetworkProject = nest.NESTProject | norse.NorseProject | pynn.PyNNProject;
export type TNetworkProps = nest.INESTNetworkProps | norse.INorseNetworkProps;
export type TNode = nest.NESTNode | norse.NorseNode;
export type TNodeParameterParent =
  | nest.NESTNode
  | nest.NESTCopyModel
  | nest.NESTNodeCompartment
  | nest.NESTNodeReceptor
  | norse.NorseNode;
export type TNodeParameterComponentProps =
  | nest.INESTNodeProps
  | nest.INESTCopyModelProps
  | nest.INESTNodeCompartmentProps
  | nest.INESTNodeReceptorProps;
export type TNodeProps = nest.INESTNodeProps;
export type TNodes = nest.NESTNodes | norse.NorseNodes;
export type TProjectDB = nest.NESTProjectDB | norse.NorseProjectDB | pynn.PyNNProjectDB;
export type TProjectProps = nest.INESTProjectProps | norse.INorseProjectProps | pynn.IPyNNProjectProps;
export type TSimulation = nest.NESTSimulation | norse.NorseSimulation | pynn.PyNNSimulation;
export type TSimulationCode = nest.NESTSimulationCode | norse.NorseSimulationCode | pynn.PyNNSimulationCode;
export type TSimulationProps = nest.INESTSimulationProps | norse.INorseSimulationProps;
export type TSynapse = nest.NESTSynapse;
export type TSynapseParameter = nest.NESTSynapseParameter;
export type TSynapseProps = nest.INESTSynapseProps;
