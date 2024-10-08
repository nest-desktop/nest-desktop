// types.ts

// import BaseTypes from "./helpers/types";
// import { ISimulatorProps, simulators } from "./simulators";

// const types: Record<string, any[]> = {};

// const updateTypes = (Types: Record<string, any>) => {
//   Object.entries(Types).forEach((entry) => {
//     const key = entry[0];
//     const value = entry[1];
//     if (key in types) {
//       types[key].push(value);
//     } else {
//       types[key] = [value];
//     }
//   });
// };

// updateTypes(BaseTypes);
// Object.values(simulators).forEach((simulator: ISimulatorProps) =>
//   updateTypes(simulator.types)
// );

// export default types;

// export type TActivity = (typeof types.activity)[number];
// export type TActivityGraph = (typeof types.activityGraph)[number];
// export type TConnection = (typeof types.connection)[number];
// export type TConnections = (typeof types.connections)[number];
// export type TModel = (typeof types.model)[number];
// export type TModelDB = (typeof types.modelDB)[number];
// export type TNetwork = (typeof types.network)[number];
// export type TNetworkGraph = (typeof types.networkGraph)[number];
// export type TNode = (typeof types.node)[number];
// export type TNodeGraph = (typeof types.nodeGraph)[number];
// export type TNodes = (typeof types.nodes)[number];
// export type TProject = (typeof types.project)[number];
// export type TProjectDB = (typeof types.projectDB)[number];
// export type TSimulation = (typeof types.simulation)[number];
// export type TSimulationCode = (typeof types.simulationCode)[number];
// export type TSynapse = (typeof types.synapse)[number];

import { Store } from "pinia";

import { BaseActivityGraph } from "@/helpers/activity/activityGraph";
import {
  BaseConnection,
  IConnectionProps,
} from "@/helpers/connection/connection";
import { BaseConnections } from "@/helpers/connection/connections";
import { BaseModel, IModelProps } from "@/helpers/model/model";
import { BaseModelDB } from "@/helpers/model/modelDB";
import { ModelParameter } from "@/helpers/model/modelParameter";
import { BaseNetwork, INetworkProps } from "@/helpers/network/network";
import { BaseNetworkGraph } from "@/helpers/networkGraph/networkGraph";
import { BaseNode, INodeProps } from "@/helpers/node/node";
import { BaseNodes } from "@/helpers/node/nodes";
import { BaseProject, IProjectProps } from "@/helpers/project/project";
import { BaseProjectDB } from "@/helpers/project/projectDB";
import {
  BaseSimulation,
  ISimulationProps,
} from "@/helpers/simulation/simulation";
import { BaseSimulationCode } from "@/helpers/simulation/simulationCode";
import { BaseSynapse, ISynapseProps } from "@/helpers/synapse/synapse";
// NEST
import { NESTActivityGraph } from "@/simulators/nest/helpers/activity/activityGraph";
import {
  INESTConnectionProps,
  NESTConnection,
} from "@/simulators/nest/helpers/connection/connection";
import { NESTConnections } from "@/simulators/nest/helpers/connection/connections";
import {
  INESTCopyModelProps,
  NESTCopyModel,
} from "@/simulators/nest/helpers/model/copyModel";
import { NESTCopyModelParameter } from "@/simulators/nest/helpers/model/copyModelParameter";
import {
  INESTModelProps,
  NESTModel,
} from "@/simulators/nest/helpers/model/model";
import { NESTModelDB } from "@/simulators/nest/helpers/model/modelDB";
import {
  INESTNetworkProps,
  NESTNetwork,
} from "@/simulators/nest/helpers/network/network";
import { NESTNetworkGraph } from "@/simulators/nest/helpers/network/networkGraph";
import { INESTNodeProps, NESTNode } from "@/simulators/nest/helpers/node/node";
import {
  INESTNodeCompartmentProps,
  NESTNodeCompartment,
} from "@/simulators/nest/helpers/node/nodeCompartment/nodeCompartment";
import {
  INESTNodeReceptorProps,
  NESTNodeReceptor,
} from "@/simulators/nest/helpers/node/nodeReceptor/nodeReceptor";
import { NESTNodes } from "@/simulators/nest/helpers/node/nodes";
import {
  INESTProjectProps,
  NESTProject,
} from "@/simulators/nest/helpers/project/project";
import { NESTProjectDB } from "@/simulators/nest/helpers/project/projectDB";
import {
  INESTSimulationProps,
  NESTSimulation,
} from "@/simulators/nest/helpers/simulation/simulation";
import { NESTSimulationCode } from "@/simulators/nest/helpers/simulation/simulationCode";
import {
  INESTSynapseProps,
  NESTSynapse,
} from "@/simulators/nest/helpers/synapse/synapse";
// Norse
import {
  INorseConnectionProps,
  NorseConnection,
} from "@/simulators/norse/helpers/connection/connection";
import { NorseConnections } from "@/simulators/norse/helpers/connection/connections";
import {
  INorseModelProps,
  NorseModel,
} from "@/simulators/norse/helpers/model/model";
import { NorseModelDB } from "@/simulators/norse/helpers/model/modelDB";
import {
  INorseNetworkProps,
  NorseNetwork,
} from "@/simulators/norse/helpers/network/network";
import {
  INorseNodeProps,
  NorseNode,
} from "@/simulators/norse/helpers/node/node";
import { NorseNodes } from "@/simulators/norse/helpers/node/nodes";
import {
  INorseProjectProps,
  NorseProject,
} from "@/simulators/norse/helpers/project/project";
import { NorseProjectDB } from "@/simulators/norse/helpers/project/projectDB";
import {
  INorseSimulationProps,
  NorseSimulation,
} from "@/simulators/norse/helpers/simulation/simulation";
import { NorseSimulationCode } from "@/simulators/norse/helpers/simulation/simulationCode";
// PyNN
import {
  IPyNNModelProps,
  PyNNModel,
} from "@/simulators/pynn/helpers/model/model";
import { PyNNModelDB } from "@/simulators/pynn/helpers/model/modelDB";
import {
  IPyNNProjectProps,
  PyNNProject,
} from "@/simulators/pynn/helpers/project/project";
import { PyNNProjectDB } from "@/simulators/pynn/helpers/project/projectDB";
import {
  IPyNNSimulationProps,
  PyNNSimulation,
} from "@/simulators/pynn/helpers/simulation/simulation";
import { PyNNSimulationCode } from "@/simulators/pynn/helpers/simulation/simulationCode";

import { ActivityChartPanelModelParameter } from "./helpers/activityChartGraph/activityChartPanelModelParameter";
import { BaseParameter } from "./helpers/common/parameter";
import { ConnectionParameter } from "./helpers/connection/connectionParameter";
import { NodeParameter } from "./helpers/node/nodeParameter";
import {
  BaseSynapseParameter,
  ISynapseParamProps,
} from "./helpers/synapse/synapseParameter";
import {
  INESTSynapseParamProps,
  NESTSynapseParameter,
} from "./simulators/nest/helpers/synapse/synapseParameter";

export type TActivityGraph = BaseActivityGraph | NESTActivityGraph;
export type TConnection = BaseConnection | NESTConnection | NorseConnection;
export type TConnectionProps =
  | IConnectionProps
  | INESTConnectionProps
  | INorseConnectionProps;
export type TConnections = BaseConnections | NESTConnections | NorseConnections;
export type TModel = BaseModel | NESTModel | NorseModel | PyNNModel;
export type TModelParameter = ModelParameter | NESTCopyModelParameter;
export type TModelDB = BaseModelDB | NESTModelDB | NorseModelDB | PyNNModelDB;
export type TModelProps =
  | IModelProps
  | INESTModelProps
  | INorseModelProps
  | IPyNNModelProps;
export type TNetwork = BaseNetwork | NESTNetwork | NorseNetwork;
export type TNetworkProps =
  | INetworkProps
  | INESTNetworkProps
  | INorseNetworkProps;
export type TNetworkGraph = BaseNetworkGraph | NESTNetworkGraph;
export type TNode = BaseNode | NESTNode | NorseNode;
export type TNodeParameterParent =
  | BaseNode
  | NESTNode
  | NESTCopyModel
  | NESTNodeCompartment
  | NESTNodeReceptor
  | NorseNode;
export type TNodeParameterComponentProps =
  | INodeProps
  | INESTNodeProps
  | INESTCopyModelProps
  | INESTNodeCompartmentProps
  | INESTNodeReceptorProps
  | INorseNodeProps;
export type TNodeProps = INodeProps | INESTNodeProps | INorseNodeProps;
export type TNodes = BaseNodes | NESTNodes | NorseNodes;
export type TParameter =
  | ActivityChartPanelModelParameter
  | ConnectionParameter
  | NodeParameter
  | BaseParameter
  | TModelParameter
  | TSynapseParameter;
export type TProject = BaseProject | NESTProject | NorseProject | PyNNProject;
export type TProjectDB =
  | BaseProjectDB
  | NESTProjectDB
  | NorseProjectDB
  | PyNNProjectDB;
export type TProjectProps =
  | IProjectProps
  | INESTProjectProps
  | INorseProjectProps
  | IPyNNProjectProps;
export type TSimulation =
  | BaseSimulation
  | NESTSimulation
  | NorseSimulation
  | PyNNSimulation;
export type TSimulationCode =
  | BaseSimulationCode
  | NESTSimulationCode
  | NorseSimulationCode
  | PyNNSimulationCode;
export type TSimulationProps =
  | ISimulationProps
  | INESTSimulationProps
  | INorseSimulationProps
  | IPyNNSimulationProps;
export type TStore = Store<string, any>;
export type TSynapse = BaseSynapse | NESTSynapse;
export type TSynapseParameter = BaseSynapseParameter | NESTSynapseParameter;
export type TSynapseParamProps = ISynapseParamProps | INESTSynapseParamProps;
export type TSynapseProps = ISynapseProps | INESTSynapseProps;
