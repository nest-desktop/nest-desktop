// projectDB.ts

import { BaseProjectDB } from "@/helpers/project/projectDB";

export class ElephantProjectDB extends BaseProjectDB {
  constructor() {
    super("ELEPHANT_PROJECT_STORE");
  }
}
