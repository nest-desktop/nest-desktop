// modelDB.ts

import { BaseModelDB } from "@/helpers/model/modelDB";

export class PyNNModelDB extends BaseModelDB {
  constructor() {
    super("PYNN_MODEL_STORE");
  }

}
