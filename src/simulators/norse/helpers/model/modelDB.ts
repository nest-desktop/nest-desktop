// modelDB.ts

import { BaseModelDB } from "@/helpers/model/modelDB";

export class NorseModelDB extends BaseModelDB {
  constructor() {
    super("NORSE_MODEL_STORE");
  }

}
