// projectTypes.ts

import { BaseProject } from "@/helpers/project/project";
import { NESTProject } from "@/simulators/nest/helpers/project/project";
import { NorseProject } from "@/simulators/norse/helpers/project/project";
import { PyNNProject } from "@/simulators/pynn/helpers/project/project";

export type TProject = BaseProject | NESTProject | NorseProject | PyNNProject;

// for components
export const TProjectProps = [
  BaseProject,
  NESTProject,
  NorseProject,
  PyNNProject,
];
