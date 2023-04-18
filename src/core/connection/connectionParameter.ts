import { Connection } from './connection';
import { Parameter } from '../parameter/parameter';

const PyNNParamIds = {
  N: 'n',
  indegree: 'n',
  outdegree: 'n',
  p: 'p_connect',
}

export class ConnectionParameter extends Parameter {
  constructor(connection: Connection, param: any) {
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
