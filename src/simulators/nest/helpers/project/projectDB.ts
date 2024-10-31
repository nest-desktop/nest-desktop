// projectDB.ts

import { BaseProjectDB } from "@/helpers/project/projectDB";

export class NESTProjectDB extends BaseProjectDB {
  constructor() {
    super("NEST_PROJECT_STORE");
  }
}
