// types.ts

import { NorseConnection } from "./connection/connection";
import { NorseConnections } from "./connection/connections";
import { NorseModel } from "./model/model";
import { NorseModelDB } from "./model/modelDB";
import { NorseNetwork } from "./network/network";
import { NorseNode } from "./node/node";
import { NorseNodes } from "./node/nodes";
import { NorseProject } from "./project/project";
import { NorseProjectDB } from "./project/projectDB";
import { NorseSimulation } from "./simulation/simulation";
import { NorseSimulationCode } from "./simulation/simulationCode";

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
  simulationCode: NorseSimulationCode,
};
