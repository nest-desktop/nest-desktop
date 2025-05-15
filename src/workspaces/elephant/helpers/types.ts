// types.ts

import { ElephantModel } from "./model/model";
import { ElephantModelDB } from "./model/modelDB";
import { ElephantProject } from "./project/project";
import { ElephantProjectDB } from "./project/projectDB";
import { ElephantAnalysisCode } from "./analysis/analysisCode";

export default {
  analysisCode: ElephantAnalysisCode,
  model: ElephantModel,
  modelDB: ElephantModelDB,
  project: ElephantProject,
  projectDB: ElephantProjectDB,
};
