// connectionParameter.ts

import { Parameter, IParamProps } from "../common/parameter";
import { TConnection } from "@/types/connectionTypes";

export interface IConnectionParamProps extends IParamProps {}

export class ConnectionParameter extends Parameter {
  private _connection: TConnection;

  constructor(connection: TConnection, paramProps: IConnectionParamProps) {
    super(paramProps, { minLevel: 3 });
    this._connection = connection;
  }

  get connection(): TConnection {
    return this._connection as TConnection;
  }

  get types(): any[] {
    const types: any[] = this.config?.localStorage.types;
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
    this.visible = false;
  }
}
