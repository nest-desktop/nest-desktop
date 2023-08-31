// projectTypes.ts

import { BaseProject } from "@/common/project/baseProject";
import { NorseProject } from "@norse/components/project/norseProject";

export type Project = BaseProject | NorseProject;
export const ProjectPropTypes = [BaseProject, NorseProject];
