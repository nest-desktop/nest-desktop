import { Config } from '../config';
import { Connection } from './connection';
import { ProjectionParameter } from './projectionParameter';


enum ConnectionType {
  convergent,
  divergent,
}

export class ConnectionProjections extends Config {
  private _allowAutapses: ProjectionParameter;
  private _allowMultapses: ProjectionParameter;
  private _allowOversizedMask: ProjectionParameter;
  private _connection: Connection;
  private _connectionType: string;
  private _delays: ProjectionParameter;
  private _kernel: ProjectionParameter;
  private _numberOfConnections: ProjectionParameter;
  private _weights: ProjectionParameter;

  constructor(connection: Connection, projections: any = {}) {
    super('ConnectionProjections');
    this._connection = connection;

    this._connectionType = projections.connectionType;
    this._allowAutapses = this.initParameter(
      'allowAutapses',
      projections.allowAutapses
    );
    this._allowMultapses = this.initParameter(
      'allowMultapses',
      projections.allowMultapses
    );
    this._allowOversizedMask = this.initParameter(
      'allowOversizedMask',
      projections.allowOversizedMask
    );
    this._delays = this.initParameter('delays', projections.delays);
    this._kernel = this.initParameter('kernel', projections.kernel);
    this._numberOfConnections = this.initParameter(
      'numberOfConnections',
      projections.numberOfConnections
    );
    this._weights = this.initParameter('weights', projections.weights);
  }

  get allowAutapses(): ProjectionParameter {
    return this._allowAutapses;
  }

  get allowMultapses(): ProjectionParameter {
    return this._allowMultapses;
  }

  get allowOversizedMask(): ProjectionParameter {
    return this._allowOversizedMask;
  }

  get connection(): Connection {
    return this._connection;
  }

  get connectionType(): string {
    return this._connectionType;
  }

  set connectionType(value: string) {
    this._connectionType = value;
  }

  get delays(): ProjectionParameter {
    return this._delays;
  }

  get numberOfConnections(): ProjectionParameter {
    return this._numberOfConnections;
  }

  get kernel(): ProjectionParameter {
    return this._kernel;
  }

  get params(): ProjectionParameter[] {
    return [this._kernel, this._numberOfConnections, this._weights, this._delays];
  }

  get weights(): ProjectionParameter {
    return this._weights;
  }

  initParameter(id, value): ProjectionParameter {
    let options: any;
    if (typeof value === 'object') {
      options = value;
    } else {
      options = this.config[id];
      if (value !== undefined) {
        options.value = value;
      }
    }
    return new ProjectionParameter(this, options);
  }

  reset(): void {
    this._connectionType = 'convergent';
    this._delays.reset();
    this._kernel.reset();
    this._numberOfConnections.reset();
    this._weights.reset();
  }

  toJSON(target: string = 'db') {
    const projections: any = {};
    if (target === 'simulator') {
      projections.connection_type = this._connectionType;
      if (this._allowAutapses.visible) {
        projections.allow_autapses = this._allowAutapses.value;
      }
      if (this._allowMultapses.visible) {
        projections.allow_multapses = this._allowMultapses.value;
      }
      if (this._allowOversizedMask.visible) {
        projections.allow_oversized_mask = this._allowOversizedMask.value;
      }
      if (this._delays.visible) {
        projections.delays = this._delays.value;
      }
      if (this._kernel.visible) {
        projections.kernel = this._kernel.value;
      }
      if (this._numberOfConnections.visible) {
        projections.number_of_connections = this._numberOfConnections.value;
      }
      if (this._weights.visible) {
        projections.weights = this._weights.value;
      }
    } else {
      projections.connectionType = this._connectionType;
      projections.allowAutapses = this._allowAutapses.toJSON();
      projections.allowMultapses = this._allowMultapses.toJSON();
      projections.allowOversizedMask = this._allowOversizedMask.toJSON();
      projections.delays = this._delays.toJSON();
      projections.kernel = this._kernel.toJSON();
      projections.numberOfConnections = this._numberOfConnections.toJSON();
      projections.weights = this._weights.toJSON();
    }
    return projections;
  }

}
