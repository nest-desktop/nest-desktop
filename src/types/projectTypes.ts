// projectTypes.ts

import { BaseProject } from "@/helpers/project/project";
import { NESTProject } from "@/simulators/nest/helpers/project/project";
import { NorseProject } from "@/simulators/norse/helpers/project/project";
import { PyNNProject } from "@/simulators/pynn/helpers/project/project";

export type Project = BaseProject | NESTProject | NorseProject | PyNNProject;

// for project bar and activity stats
export const ProjectPropTypes = [
  BaseProject,
  NESTProject,
  NorseProject,
  PyNNProject,
];
