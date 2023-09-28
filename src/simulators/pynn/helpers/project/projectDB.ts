// projectDB.ts

import { BaseProjectDB } from "@/helpers/project/projectDB";

export class PyNNProjectDB extends BaseProjectDB {
  constructor() {
    super("PYNN_PROJECT_STORE");
  }
}
