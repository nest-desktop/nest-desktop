import { Config } from '../config'
import { Connection } from './connection';


export class ConnectionProjections {
  config: Config;
  connection: Connection;

  connectionType: string;
  numberOfConnections: number;
  kernel: any;
  weights: any;
  delays: any;
  allowAutapses: boolean;
  allowMultapses: boolean;
  allowOversizedMask: boolean;

  constructor(connection: Connection, projections: any = {}) {
    this.config = new Config(this.constructor.name);
    this.connection = connection;

    this.connectionType = projections.connectionType || 'convergent';
    this.numberOfConnections = projections.numberOfConnections || 1;
    this.kernel = projections.kernel || 1;
    this.weights = projections.weights || 1;
    this.delays = projections.delays || 1;
    this.allowAutapses = projections.allowAutapses || false;
    this.allowMultapses = projections.allowMultapses || false;
    this.allowOversizedMask = projections.allowOversizedMask || false;
  }

  reset(): void {
    this.weights = 1;
      this.delays = 1;
      this.kernel = 1;
      this.connectionType = 'convergent';
      this.numberOfConnections = 1;
  }

  serialize(to: string) {
    const projections: any = {
      kernel: this.kernel,
      weights: this.weights,
      delays: this.delays,
    };
    if (to === 'stimulator') {
      projections['number_of_connections'] = this.numberOfConnections;
      projections['connection_type'] = this.connectionType;
      projections['allow_autapses'] = this.allowAutapses;
      projections['allow_multapses'] = this.allowMultapses;
      projections['allow_oversized_mask'] = this.allowOversizedMask;
    } else {
      projections['numberOfConnections'] = this.numberOfConnections;
      projections['connectionType'] = this.connectionType;
      projections['allowAutapses'] = this.allowAutapses;
      projections['allowMultapses'] = this.allowMultapses;
      projections['allowOversizedMask'] = this.allowOversizedMask;
    }
    return projections;
  }

}
