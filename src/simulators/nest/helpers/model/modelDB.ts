// modelDB.ts

import { BaseModelDB } from "@/helpers/model/modelDB";

export class NESTModelDB extends BaseModelDB {
  constructor() {
    super("NEST_MODEL_STORE");
  }
}
