// projectDB.ts

import { BaseProjectDB } from "@/project";

import type { INESTProjectState, NESTProject } from "../project";

export class NESTProjectDB extends BaseProjectDB<NESTProject, INESTProjectState> {
  constructor() {
    super("NEST_PROJECT_STORE");
  }
}
