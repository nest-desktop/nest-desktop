import { Connection } from '../connection/connection';
import { Model } from '../model/model';
import { ModelParameter } from '../parameter/modelParameter';
import { SynapseCode } from './synapseCode';

export class Synapse {
  private readonly _name = 'Synapse';
  private _code: SynapseCode;
  private _connection: Connection; // parent
  private _modelId: string;
  private _params: ModelParameter[] = [];

  constructor(connection: any, synapse: any) {
    this._connection = connection;
    this._code = new SynapseCode(this);

    if (synapse !== undefined && synapse.params.length > 0) {
      this._modelId = synapse.model || 'static_synapse';
      this.initParameters(synapse);
    } else {
      this._modelId = 'static_synapse';
      this.initParameters();
    }
  }

  get code(): SynapseCode {
    return this._code;
  }

  get connection(): Connection {
    return this._connection;
  }

  get model(): Model {
    return this._connection.network.project.app.model.getModel(this._modelId);
  }

  /**
   * Returns all visible parameters.
   */
  get filteredParams(): ModelParameter[] {
    return this._params.filter((param: ModelParameter) => param.visible);
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

  get models(): Model[] {
    const elementType: string = this.model.elementType;
    return this._connection.network.project.app.model.filterModels(elementType);
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
    this._connection.network.clean();
    this.synapseChanges();
  }

  get name(): string {
    return this._name;
  }

  get params(): ModelParameter[] {
    return this._params;
  }

  get weight(): number {
    const weight: any = this._params.find(
      (param: ModelParameter) => param.id === 'weight'
    );
    return weight ? weight.value : 1;
  }

  set weight(value: number) {
    const weight: any = this._params.find(
      (param: ModelParameter) => param.id === 'weight'
    );
    weight.value = value;
  }

  get delay(): number {
    const delay: any = this._params.find(
      (param: ModelParameter) => param.id === 'delay'
    );
    return delay ? delay.value : 1;
  }

  set delay(value: number) {
    const delay: any = this._params.find(
      (param: ModelParameter) => param.id === 'delay'
    );
    delay.value = value;
  }

  /**
   * Observer for synapse changes.
   *
   * @remarks
   * It emits connection changes.
   */
  synapseChanges(): void {
    this._connection.connectionChanges();
  }

  /**
   * Initialize synapse parameters.
   */
  initParameters(synapse: any = null): void {
    // Update parameters from model or node
    this._params = [];
    if (this.model && synapse && synapse.hasOwnProperty('params')) {
      this.model.params.forEach((modelParam: ModelParameter) => {
        const synParam = synapse.params.find(
          (param: any) => param.id === modelParam.id
        );
        this.addParameter(synParam || modelParam);
      });
    } else if (this.model) {
      this.model.params.forEach((param: ModelParameter) =>
        this.addParameter(param)
      );
    } else if (synapse.hasOwnProperty('params')) {
      synapse.params.forEach((param: ModelParameter) =>
        this.addParameter(param)
      );
    }
  }

  /**
   * Add synapse parameter.
   */
  addParameter(param: any): void {
    this._params.push(new ModelParameter(this, param));
  }

  /**
   * Sets all params to visible.
   */
  public showAllParams(): void {
    this.params.forEach(
      (param: ModelParameter) => (param.state.visible = true)
    );
  }

  /**
   * Sets all params to invisible.
   */
  public hideAllParams(): void {
    this.params.forEach(
      (param: ModelParameter) => (param.state.visible = false)
    );
  }

  /**
   * Inverse synaptic weight.
   */
  inverseWeight(): void {
    const weight: ModelParameter = this._params.find(
      (param: ModelParameter) => param.id === 'weight'
    );
    weight.state.visible = true;
    weight.value = -1 * weight.value;
    this._connection.connectionChanges();
  }

  /**
   * Serialize for JSON.
   * @return synapse object
   */
  toJSON(): any {
    const synapse: any = {
      model: this._modelId,
      params: this._params.map((param: ModelParameter) => param.toJSON()),
    };
    return synapse;
  }
}
