// modelDB.ts

import { BaseModelDB } from "@/model/stores/modelDB";

import type { INESTModelState, NESTModel } from "../model";

export class NESTModelDB extends BaseModelDB<NESTModel, INESTModelState> {
  constructor() {
    super("NEST_MODEL_STORE");
  }
}
