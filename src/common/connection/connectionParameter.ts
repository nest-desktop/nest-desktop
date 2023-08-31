// connectionParameter.ts

import { Parameter, ParameterProps } from "@/helpers/parameter";

import { Connection } from "@/types/connectionTypes";

export interface ConnectionParameterProps extends ParameterProps {}

export class ConnectionParameter extends Parameter {
  private _connection: Connection;

  constructor(connection: Connection, param: ConnectionParameterProps) {
    super(param);
    this._connection = connection;
  }

  get connection(): Connection {
    return this._connection as Connection;
  }

  get types(): any[] {
    const types: any[] = this.config.types;
    return types;
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
}
