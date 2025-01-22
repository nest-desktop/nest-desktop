// modelDB.ts

import { BaseModelDB } from "@/helpers/model/modelDB";

export class ElephantModelDB extends BaseModelDB {
  constructor() {
    super("ELEPHANT_MODEL_STORE");
  }
}
