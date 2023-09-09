// norseProjectDB.ts

import { BaseProjectDB } from "@/helpers/project/baseProjectDB";

export class NorseProjectDB extends BaseProjectDB {
  constructor() {
    super("NORSE_PROJECT_STORE");
  }
}
