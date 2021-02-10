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
    return [
      this._kernel,
      this._numberOfConnections,
      this._weights,
      this._delays,
    ];
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

  toJSON() {
    const projections: any = {
      allowAutapses: this._allowAutapses.toJSON(),
      allowMultapses: this._allowMultapses.toJSON(),
      allowOversizedMask: this._allowOversizedMask.toJSON(),
      connectionType: this._connectionType,
      delays: this._delays.toJSON(),
      kernel: this._kernel.toJSON(),
      numberOfConnections: this._numberOfConnections.toJSON(),
      weights: this._weights.toJSON(),
    };
    return projections;
  }
}
