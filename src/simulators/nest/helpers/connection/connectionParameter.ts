// connectionParameter.ts

import { Parameter, ParameterProps } from "@/helpers/common/parameter";

import { NESTConnection } from "./connection";

export interface NESTConnectionParameterProps extends ParameterProps {}

const PyNNParamIds: { [key: string]: string } = {
  N: "n",
  indegree: "n",
  outdegree: "n",
  p: "p_connect",
};

export class NESTConnectionParameter extends Parameter {
  private _connection: NESTConnection;

  constructor(connection: NESTConnection, param: NESTConnectionParameterProps) {
    super(param);
    this._connection = connection;
  }

  get connection(): NESTConnection {
    return this._connection as NESTConnection;
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
