// projectDB.ts

import { BaseProjectDB } from "@/project";

import type { NorseProject } from "../project";

export class NorseProjectDB extends BaseProjectDB<NorseProject> {
  constructor() {
    super("NORSE_PROJECT_STORE");
  }
}
