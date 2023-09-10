// nestProjectDB.ts

import { BaseProjectDB } from "@/helpers/project/baseProjectDB";

export class NESTProjectDB extends BaseProjectDB {
  constructor() {
    super("NEST_PROJECT_STORE");
  }
}
