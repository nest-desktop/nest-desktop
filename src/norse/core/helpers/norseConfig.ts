// norseConfig.ts

import { Config } from "@/helpers/config";

export class NorseConfig extends Config {
  constructor(name: string) {
    super('Norse' + name);
  }
}
