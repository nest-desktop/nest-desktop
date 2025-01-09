// types

import { Activity } from "./activity/activity";
import { BaseActivityGraph } from "./activityGraph/activityGraph";
import { BaseConnection } from "./connection/connection";
import { BaseConnections } from "./connection/connections";
import { BaseModel } from "./model/model";
import { BaseModelDB } from "./model/modelDB";
import { BaseNetwork } from "./network/network";
import { BaseNetworkGraph } from "./networkGraph/networkGraph";
import { BaseNode } from "./node/node";
import { BaseNodes } from "./node/nodes";
import { NodeGraph } from "./nodeGraph/nodeGraph";
import { BaseProject } from "./project/project";
import { BaseProjectDB } from "./project/projectDB";
import { BaseSimulation } from "./simulation/simulation";
import { BaseSimulationCode } from "./simulation/simulationCode";
import { BaseSynapse } from "./synapse/synapse";

export default {
  activity: Activity,
  activityGraph: BaseActivityGraph,
  connection: BaseConnection,
  connections: BaseConnections,
  model: BaseModel,
  modelDB: BaseModelDB,
  network: BaseNetwork,
  networkGraph: BaseNetworkGraph,
  node: BaseNode,
  nodes: BaseNodes,
  nodeGraph: NodeGraph,
  project: BaseProject,
  projectDB: BaseProjectDB,
  simulation: BaseSimulation,
  simulationCode: BaseSimulationCode,
  synapse: BaseSynapse,
};
