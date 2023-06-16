// connectionParameter.ts

import { Parameter, ParameterProps } from "@/helpers/parameter";

import { Connection } from "./connection";

export interface ConnectionParameterProps extends ParameterProps {}

const PyNNParamIds: { [key: string]: string } = {
  N: "n",
  indegree: "n",
  outdegree: "n",
  p: "p_connect",
};

export class ConnectionParameter extends Parameter {
  private _parent: Connection;

  constructor(connection: Connection, param: ConnectionParameterProps) {
    super(param);
    this._parent = connection;
  }

  get parent(): Connection {
    return this._parent as Connection;
  }

  /**
   * Check if this parameter can be spatial
   * when the connection is spatial.
   */
  get isSpatial(): boolean {
    return this._parent.isBothSpatial;
  }

  get types(): any[] {
    const types: any[] = this.config.types;
    return !this.isSpatial
      ? types.filter((type: any) => !type.id.startsWith("spatial"))
      : types;
  }

  /**
   * Trigger changes when parameter is changed.
   */
  override paramChanges(): void {
    this.parent.connectionChanges();
  }

  PyNNParamId(): string {
    return PyNNParamIds[this.id];
  }
}
