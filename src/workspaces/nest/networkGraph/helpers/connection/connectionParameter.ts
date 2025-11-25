// connectionParameter.ts

import { ConnectionParameter } from "@/networkGraph/helpers/connection/connectionParameter";
// import type { ConnectionParameters } from "@/networkGraph/helpers/connection/connectionParameters";
import type { IParamType } from "@/helpers/common";

import type { NESTConnection } from "./connection";

export class NESTConnectionParameter extends ConnectionParameter {
  get connection(): NESTConnection {
    return this.connectionParams.connection as NESTConnection;
  }

  /**
   * Check if this parameter can be spatial
   * when the connection is spatial.
   */
  get isSpatial(): boolean {
    return this.connection.isBothSpatial;
  }

  override get types(): IParamType[] {
    const types: IParamType[] = this.config?.localStorage.types;
    return !this.isSpatial ? types.filter((type: IParamType) => !type.id.startsWith("spatial")) : types;
  }
}
