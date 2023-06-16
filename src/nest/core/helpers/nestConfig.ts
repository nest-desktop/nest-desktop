// nestConfig.ts

import { Config } from "@/helpers/config";

export class NESTConfig extends Config {

  constructor(name: string) {
    super(name)
  }

  override async importConfig(): Promise<any> {
    return import(`@nest/assets/config/${this.configName}.json`);
  }
}
