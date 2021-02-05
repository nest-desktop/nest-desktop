import { Connection } from './connection';
import { Model } from '../model/model';
import { Parameter } from '../parameter';
import { SynapseCode } from './synapseCode';

export class Synapse {
  private _code: SynapseCode;
  private _connection: Connection; // parent
  private _modelId: string;
  private _params: Parameter[] = [];

  constructor(connection: any, synapse: any) {
    this._connection = connection;
    this._code = new SynapseCode(this);
    this._modelId = '';

    if (synapse !== undefined && synapse.params.length > 0) {
      this._modelId = synapse.model || 'static_synapse';
      this.initParameters(synapse);
    } else {
      this.modelId = 'static_synapse';
    }
  }

  get code(): SynapseCode {
    return this._code;
  }

  get model(): Model {
    return this._connection.network.project.app.getModel(this._modelId);
  }

  get filteredParams(): Parameter[] {
    return this._params.filter((param: Parameter) => param.visible);
  }

  /**
   * Set model.
   *
   * @remarks
   * Save model id, see modelId.
   *
   * @param value - synapse model
   */
  set model(model: Model) {
    this.modelId = model.id;
  }

  get modelId(): string {
    return this._modelId;
  }

  /**
   * Set model id.
   *
   * @remarks
   * It initializes parameters.
   *
   * @param value - id of the model
   */
  set modelId(value: string) {
    this._modelId = value;
    this.initParameters();
  }

  get params(): Parameter[] {
    return this._params;
  }

  get weight(): number {
    const weight: any = this._params.find(
      (param: Parameter) => param.id === 'weight'
    );
    return weight ? weight.value : 1;
  }

  set weight(value: number) {
    const weight: any = this._params.find(
      (param: Parameter) => param.id === 'weight'
    );
    weight.value = value;
  }

  get delay(): number {
    const delay: any = this._params.find(
      (param: Parameter) => param.id === 'delay'
    );
    return delay ? delay.value : 1;
  }

  set delay(value: number) {
    const delay: any = this._params.find(
      (param: Parameter) => param.id === 'delay'
    );
    delay.value = value;
  }

  /**
   * Initialize synapse parameters.
   */
  initParameters(synapse: any = null): void {
    // Update parameters from model or node
    this._params = [];
    if (this.model && synapse && synapse.hasOwnProperty('params')) {
      this.model.params.forEach((modelParam: Parameter) => {
        const synParam = synapse.params.find(
          (param: Parameter) => param.id === modelParam.id
        );
        this.addParameter(synParam || modelParam);
      });
    } else if (this.model) {
      this.model.params.forEach((param: Parameter) => this.addParameter(param));
    } else if (synapse.hasOwnProperty('params')) {
      synapse.params.forEach((param: Parameter) => this.addParameter(param));
    }
  }

  /**
   * Add synapse parameter.
   */
  addParameter(param: any): void {
    this._params.push(new Parameter(this._connection, param));
  }

  /**
   * Inverse synaptic weight.
   */
  inverseWeight(): void {
    this.weight = -1 * this.weight;
    this._connection.connectionChanges();
  }

  /**
   * Serialize for JSON.
   * @return synapse object
   */
  toJSON(target: string = 'db'): any {
    const synapse: any = {
      model: this._modelId,
    };

    if (target === 'simulator') {
      // Collect specifications of the synapse
      this._params
        .filter(
          (param: Parameter) => param.visible === undefined || param.visible
        )
        .forEach((param: Parameter) => (synapse[param.id] = param.value));
    } else {
      synapse.params = this._params.map((param: Parameter) => param.toJSON());
    }

    return synapse;
  }
}
