// connectionParameter.ts

import { IParamProps, IParamType } from "@/helpers/common/parameter";
import { ConnectionParameter } from "@/helpers/connection/connectionParameter";

import { NESTConnection } from "./connection";

export interface INESTConnectionParamProps extends IParamProps {}

const PyNNParamIds: Record<string, string> = {
  N: "n",
  indegree: "n",
  outdegree: "n",
  p: "p_connect",
};

export class NESTConnectionParameter extends ConnectionParameter {
  constructor(
    connection: NESTConnection,
    paramProps: INESTConnectionParamProps
  ) {
    super(connection, paramProps);
  }

  override get connection(): NESTConnection {
    return this._connection as NESTConnection;
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
    return !this.isSpatial
      ? types.filter((type: IParamType) => !type.id.startsWith("spatial"))
      : types;
  }

  PyNNParamId(): string {
    return PyNNParamIds[this.id];
  }
}
