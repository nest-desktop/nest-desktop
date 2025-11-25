// types

import { Activity } from "./activity/activity";
import { BaseActivityGraph } from "./activityGraph/activityGraph";
import { BaseCode } from "../codeGraph/helpers/codeHandler";
import { BaseConnection } from "../networkGraph/helpers/connection/connection";
import { BaseConnections } from "../networkGraph/helpers/connection/connections";
import { BaseModel } from "./model/model";
import { BaseModelDB } from "./model/modelDB";
import { BaseNetwork } from "../networkGraph/helpers/network/network";
import { BaseNetworkGraph } from "../networkGraph/components/helpers/networkGraph";
import { BaseNode } from "../networkGraph/helpers/node/node";
import { BaseNodes } from "../networkGraph/helpers/node/nodes";
import { BaseProject } from "./project/project";
import { BaseProjectDB } from "./project/projectDB";
import { BaseSimulation } from "./simulation/simulation";
import { BaseSynapse } from "../networkGraph/helpers/synapse/synapse";
import { NodeGraph } from "../networkGraph/helpers/nodeGraph/nodeGraph";

export default {
  activity: Activity,
  activityGraph: BaseActivityGraph,
  code: BaseCode,
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
  synapse: BaseSynapse,
};
