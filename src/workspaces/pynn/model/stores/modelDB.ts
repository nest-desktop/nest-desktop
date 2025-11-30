// modelDB.ts

import { BaseModelDB } from "@/model";

export class PyNNModelDB extends BaseModelDB {
  constructor() {
    super("PYNN_MODEL_STORE");
  }
}
