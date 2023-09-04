// nestConfig.ts

import { Config } from "@/helpers/config";

export class NESTConfig extends Config {
  constructor(name: string) {
    super('NEST' + name);
  }
}
