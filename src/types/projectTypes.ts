// projectTypes.ts

import { BaseProject } from "@/helpers/project/baseProject";
import { NESTProject } from "@nest/helpers/project/nestProject";
import { NorseProject } from "@norse/helpers/project/norseProject";

export type Project = BaseProject | NESTProject | NorseProject;

// for activity stats
export const ProjectPropTypes = [BaseProject, NESTProject, NorseProject];
