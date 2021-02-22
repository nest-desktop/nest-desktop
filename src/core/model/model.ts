import { App } from '../app';
import { Parameter } from '../parameter';
import { ModelCode } from './modelCode';

export class Model {
  private readonly _name = 'Model';

  private _abbreviation: string;
  private _app: App; // parent
  private _code: ModelCode; // code for model
  private _doc: any; // doc data of the database
  private _elementType: string; // element type of the model
  private _existing: string; // existing model in NEST
  private _id: string; // model id
  private _idx: number; // generative
  private _label: string; // model label for view
  private _params: Parameter[] = []; // model parameters
  private _recordables: string[]; // recordables for multimeter

  constructor(app: App, model: any) {
    this._app = app;
    this._code = new ModelCode(this);

    this._doc = model;
    this._id = model.id;
    this._idx = this.app.models.length;
    this._elementType =
      model.elementType !== undefined ? model.elementType : model.element_type;
    this._existing = model.existing || model.id;

    this._label = model.label || '';
    this._abbreviation = model.abbreviation;
    model.params.forEach((param: any) => this.addParameter(param));
    this._recordables = model.recordables || [];
  }

  get abbreviation(): string {
    return this._abbreviation;
  }

  get app(): App {
    return this._app;
  }

  get code(): ModelCode {
    return this._code;
  }

  get elementType(): string {
    return this._elementType;
  }

  get existing(): string {
    return this._existing;
  }

  get id(): string {
    return this._id;
  }

  get idx(): number {
    return this._idx;
  }

  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
  }

  get model(): Model {
    return this;
  }

  get name(): string {
    return this._name;
  }

  get params(): Parameter[] {
    return this._params;
  }

  get recordables(): string[] {
    return this._recordables;
  }

  get value(): string {
    return this.id;
  }

  getParameter(id: string): Parameter {
    return this._params.find((param: Parameter) => param.id === id);
  }

  addParameter(param: any): void {
    this._params.push(new Parameter(this, param));
  }

  newParameter(paramId: string, value: any): void {
    const param: any = {
      id: paramId,
      label: paramId,
      value,
      level: 1,
      input: 'valueSlider',
      min: 0,
      max: 100,
      step: 1,
    };
    if (Array.isArray(value)) {
      param.input = 'arrayInput';
    }
    this.addParameter(param);
    this._params.sort((a: any, b: any) => a.id - b.id);
  }

  removeParameter(paramId: string): void {
    this._params = this.params.filter(
      (param: Parameter) => param.id !== paramId
    );
  }

  updateParameter(param: any): void {
    const idx: number = this._params
      .map((p: Parameter) => p.id)
      .indexOf(param.id);
    this._params[idx] = new Parameter(this, param);
  }

  clean(): void {
    this._idx = this._app.models.indexOf(this);
  }

  clone(): Model {
    return new Model(this._app, this);
  }

  isNeuron(): boolean {
    return this._elementType === 'neuron';
  }

  isRecorder(): boolean {
    return this._elementType === 'recorder';
  }

  isStimulator(): boolean {
    return this._elementType === 'stimulator';
  }

  delete(): Promise<any> {
    return this._app.deleteModel(this._doc._id);
  }

  save(): Promise<any> {
    return this._app.saveModel(this);
  }

  toJSON(): any {
    const model: any = {
      abbreviation: this._abbreviation,
      elementType: this._elementType,
      existing: this._existing,
      id: this._id,
      label: this._label,
      params: this._params.map((param: Parameter) => param.toJSON()),
      version: this._app.version,
    };

    // Add recordables if provided.
    if (this.recordables.length > 0) {
      model.recordables = this._recordables;
    }
    return model;
  }
}
