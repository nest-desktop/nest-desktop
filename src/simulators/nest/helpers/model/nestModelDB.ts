// nestModelDB.ts

import { BaseModelDB } from "@/helpers/model/baseModelDB";

export class NESTModelDB extends BaseModelDB {
  constructor() {
    super("NEST_MODEL_STORE");
  }
}
