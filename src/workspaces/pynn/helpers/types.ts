// types.ts

import { PyNNModel } from "./model/model";
import { PyNNModelDB } from "./model/modelDB";
import { PyNNProject } from "./project/project";
import { PyNNProjectDB } from "./project/projectDB";
import { PyNNSimulation } from "./simulation/simulation";
import { PyNNSimulationCode } from "./code/simulationCode";

export default {
  model: PyNNModel,
  modelDB: PyNNModelDB,
  project: PyNNProject,
  projectDB: PyNNProjectDB,
  simulation: PyNNSimulation,
  simulationCode: PyNNSimulationCode,
};
