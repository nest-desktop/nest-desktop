// types.ts

import { NESTActivityGraph } from "./activityGraph/activityGraph";
import { NESTConnection } from "./connection/connection";
import { NESTModel } from "./model/model";
import { NESTModelDB } from "./model/modelDB";
import { NESTNetwork } from "./network/network";
import { NESTNetworkGraph } from "./network/networkGraph";
import { NESTNode } from "./node/node";
import { NESTNodeParameter } from "./node/nodeParameter";
import { NESTNodes } from "./node/nodes";
import { NESTProject } from "./project/project";
import { NESTProjectDB } from "./project/projectDB";
import { NESTSimulation } from "./simulation/simulation";
import { NESTSimulationCode } from "./simulation/simulationCode";
import { NESTSynapse } from "./synapse/synapse";

export default {
  activityGraph: NESTActivityGraph,
  connection: NESTConnection,
  model: NESTModel,
  modelDB: NESTModelDB,
  network: NESTNetwork,
  networkGraph: NESTNetworkGraph,
  node: NESTNode,
  nodeParameter: NESTNodeParameter,
  nodes: NESTNodes,
  project: NESTProject,
  projectDB: NESTProjectDB,
  simulation: NESTSimulation,
  simulationCode: NESTSimulationCode,
  synapse: NESTSynapse,
};
