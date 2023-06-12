// connectionParameter.ts

import { Connection } from "./connection";
import { Parameter, ParameterProps } from "../parameter";

export interface ConnectionParameterProps extends ParameterProps {}

const PyNNParamIds: { [key: string]: string } = {
  N: "n",
  indegree: "n",
  outdegree: "n",
  p: "p_connect",
};

export class ConnectionParameter extends Parameter {
  constructor(connection: Connection, param: ConnectionParameterProps) {
    super(connection, param);
  }

  get connection(): Connection {
    return this.parent as Connection;
  }

  PyNNParamId(): string {
    return PyNNParamIds[this.id];
  }

  /**
   * Trigger changes when parameter is changed.
   */
  override paramChanges(): void {
    this.connection.connectionChanges();
  }
}
