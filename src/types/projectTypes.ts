// projectTypes.ts

import { BaseProject, IProjectProps } from "@/helpers/project/project";
import {
  INESTProjectProps,
  NESTProject,
} from "@/simulators/nest/helpers/project/project";
import {
  INorseProjectProps,
  NorseProject,
} from "@/simulators/norse/helpers/project/project";
import {
  IPyNNProjectProps,
  PyNNProject,
} from "@/simulators/pynn/helpers/project/project";

export type TProject = BaseProject | NESTProject | NorseProject | PyNNProject;
export type TProjectProps =
  | IProjectProps
  | INESTProjectProps
  | INorseProjectProps
  | IPyNNProjectProps;

export const ProjectComponentProps = [
  BaseProject,
  NESTProject,
  NorseProject,
  PyNNProject,
];
