// projectDB.ts

import { BaseProjectDB } from "@/project";

export class PyNNProjectDB extends BaseProjectDB {
  constructor() {
    super("PYNN_PROJECT_STORE");
  }
}
