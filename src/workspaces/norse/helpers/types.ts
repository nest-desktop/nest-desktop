// types.ts

import { NorseConnection } from "../networkGraph/helpers/connection/connection";
import { NorseConnections } from "../networkGraph/helpers/connection/connections";
import { NorseModel } from "./model/model";
import { NorseModelDB } from "./model/modelDB";
import { NorseNetwork } from "../networkGraph/helpers/network/network";
import { NorseNode } from "../networkGraph/helpers/node/node";
import { NorseNodes } from "../networkGraph/helpers/node/nodes";
import { NorseProject } from "./project/project";
import { NorseProjectDB } from "./project/projectDB";
import { NorseSimulation } from "./simulation/simulation";
// import { NorseSimulationCode } from "./simulation/simulationCode";

export default {
  connection: NorseConnection,
  connections: NorseConnections,
  model: NorseModel,
  modelDB: NorseModelDB,
  network: NorseNetwork,
  node: NorseNode,
  nodes: NorseNodes,
  project: NorseProject,
  projectDB: NorseProjectDB,
  simulation: NorseSimulation,
  // simulationCode: NorseSimulationCode,
};
