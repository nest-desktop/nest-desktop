import { Connection } from './connection';
import { Parameter } from '../parameter/parameter';

export class ConnectionParameter extends Parameter {
  constructor(connection: Connection, param: any) {
    super(connection, param);
  }

  get connection(): Connection {
    return this.parent as Connection;
  }

  /**
   * Reset constant value taken from component.
   */
  override reset(): void {
    this.type = 'constant';
    this.value = this.options.value;
  }

  /**
   * Trigger changes when parameter is changed.
   */
  override paramChanges(): void {
    this.connection.connectionChanges();
  }
}
