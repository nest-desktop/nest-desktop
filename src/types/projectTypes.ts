// projectTypes.ts

import { BaseProject } from "@/helpers/project/baseProject";
import { NESTProject } from "@/simulators/nest/helpers/project/nestProject";
import { NorseProject } from "@/simulators/norse/helpers/project/norseProject";

export type Project = BaseProject | NESTProject | NorseProject;

// for project bar and activity stats
export const ProjectPropTypes = [BaseProject, NESTProject, NorseProject];
