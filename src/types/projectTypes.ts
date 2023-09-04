// projectTypes.ts

import { BaseProject } from "@/components/project/baseProject";
import { NESTProject } from "@nest/components/project/nestProject";
import { NorseProject } from "@norse/components/project/norseProject";

export type Project = BaseProject | NESTProject | NorseProject;

// for activity stats
export const ProjectPropTypes = [BaseProject, NESTProject, NorseProject];
