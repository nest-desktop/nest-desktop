// modelDB.ts

import { BaseModelDB } from "@/model";

import type { NorseModel } from "../model";

export class NorseModelDB extends BaseModelDB<NorseModel> {
  constructor() {
    super("NORSE_MODEL_STORE");
  }
}
