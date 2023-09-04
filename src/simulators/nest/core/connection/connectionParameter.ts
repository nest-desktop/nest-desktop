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
  private _connection: Connection;

  constructor(connection: Connection, param: ConnectionParameterProps) {
    super(param);
    this._connection = connection;
  }

  get connection(): Connection {
    return this._connection as Connection;
  }

  /**
   * Check if this parameter can be spatial
   * when the connection is spatial.
   */
  get isSpatial(): boolean {
    return this._connection.isBothSpatial;
  }

  get types(): any[] {
    const types: any[] = this.config.types;
    return !this.isSpatial
      ? types.filter((type: any) => !type.id.startsWith("spatial"))
      : types;
  }

  get visible(): boolean {
    return this.connection.paramsVisible.includes(this.id);
  }

  set visible(value: boolean) {
    const isVisible = this.connection.paramsVisible.includes(this.id);
    if (value && !isVisible) {
      this.connection.paramsVisible.push(this.id);
    } else if (!value && isVisible) {
      this.connection.paramsVisible = this.connection.paramsVisible.filter(
        (paramId: string) => paramId !== this.id
      );
    }
  }

  /**
   * Observer for parameter changes.
   *
   * @remarks
   * It emits connection changes.
   */
  override changes(): void {
    this.connection.changes();
  }

  /**
   * Hide this parameter.
   */
  hide(): void {
    this.visible = false
  }

  PyNNParamId(): string {
    return PyNNParamIds[this.id];
  }
}
