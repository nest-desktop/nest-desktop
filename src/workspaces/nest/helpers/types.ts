// types.ts

import { NESTActivityGraph } from "./activityGraph/activityGraph";
import { NESTConnection } from "../networkGraph/helpers/connection/connection";
import { NESTModel } from "./model/model";
import { NESTModelDB } from "./model/modelDB";
import { NESTNetwork } from "../networkGraph/helpers/network/network";
import { NESTNetworkGraph } from "../networkGraph/helpers/network/networkGraph";
import { NESTNode } from "../networkGraph/helpers/node/node";
import { NESTNodeParameter } from "../networkGraph/helpers/node/nodeParameters";
import { NESTNodes } from "../networkGraph/helpers/node/nodes";
import { NESTProject } from "./project/project";
import { NESTProjectDB } from "./project/projectDB";
import { NESTSimulation } from "./simulation/simulation";
// import { NESTSimulationCode } from "./simulation/simulationHandler";
import { NESTSynapse } from "../networkGraph/helpers/synapse/synapse";

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
  // simulationCode: NESTSimulationCode,
  synapse: NESTSynapse,
};
