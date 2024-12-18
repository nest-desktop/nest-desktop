// projectDB.ts

import { BaseProjectDB } from "@/helpers/project/projectDB";

export class NorseProjectDB extends BaseProjectDB {
  constructor() {
    super("NORSE_PROJECT_STORE");
  }
}
