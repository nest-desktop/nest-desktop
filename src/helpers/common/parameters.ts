// parameters.ts

import type { AbstractCodeNode, CodeNodeInterface } from "@babsey/code-graph";

import { CodeNodeMask } from "@/codeGraph/helpers/codeNodeMask";
import type { Class, TParameter } from "@/types";

import type { IBaseState } from "./base";

import { BaseParameter, type IParamState } from "./parameter";

export class BaseParameters extends CodeNodeMask<Record<string, IParamState>> {
  private _params: Record<string, TParameter> = {};
  public _paramsVisible: string[] = [];

  constructor() {
    super();
  }

  get Parameter(): Class<BaseParameter> {
    return BaseParameter;
  }

  get filteredParams(): TParameter[] {
    return this._paramsVisible.map((paramId) => this._params[paramId]);
  }

  get hasSomeVisibleParams(): boolean {
    return this._paramsVisible.length > 0;
  }

  override get hashObject(): IBaseState {
    return {
      params: this.paramsAll.map((param: TParameter) => param.save()),
    };
  }

  get paramInterfaces(): Record<string, CodeNodeInterface> {
    if (!this.codeNode) return {};
    return Object.fromEntries(Object.entries(this.codeNode.inputs).filter((intf) => this.paramKeys.includes(intf[0])));
  }

  get paramKeys(): string[] {
    return Object.keys(this._params);
  }

  get params(): Record<string, TParameter> {
    return this._params;
  }

  get paramsAll(): TParameter[] {
    return Object.values(this._params);
  }

  get paramsVisible(): string[] {
    return this._paramsVisible;
  }

  set paramsVisible(values: string[]) {
    this.updateCodeNode(values);
    // this.changes({ preventSimulation: true });
  }

  /**
   * Add parameter component.
   * @param paramState parameter state
   * @param visible boolean
   */
  addParameter(paramState: IParamState, visible: boolean = false): void {
    this.logger.trace("add parameter", paramState.id);

    const param = new this.Parameter(this);
    param.load(paramState);
    this._params[paramState.id] = param;

    if (visible) this.paramsVisible.push(paramState.id);
  }

  /**
   * Observer for parameter changes.
   */
  changes(state = {}): void {
    this.logger.trace("changes", state);
  }

  /**
   * Empty parameters
   */
  emptyParams(): void {
    this._params = {};
    this._paramsVisible = [];
  }

  /**
   * Get parameter component.
   * @param paramId parameter ID
   * @return parameter component
   */
  getParameter(paramId: string): TParameter | undefined {
    return this._params[paramId];
  }

  /**
   * Check if it has parameter component.
   * @param paramId parameter ID
   */
  hasParameter(paramId: string): boolean {
    return this.paramKeys.some((paramKey: string) => paramKey === paramId);
  }

  /**
   * Sets all params to invisible.
   */
  hideAllParams(emitChanges: boolean = true): void {
    this.paramsVisible = [];
    if (emitChanges) this.changes();
  }

  init(): void {
    this._paramsVisible = Object.keys(this.codeNode.inputs).filter(
      (paramId) => paramId !== "_code" && !this.codeNode.inputs[paramId].hidden,
    );
  }

  /**
   * Load parameters from state.
   * @return params state
   */
  load(paramStates: Record<string, IParamState>) {
    this.logger.trace("load parameters");

    this.emptyParams();
    if (paramStates) {
      Object.entries(paramStates).forEach(([paramKey, param]: [string, IParamState]) =>
        this.addParameter({ ...param, id: paramKey }, true),
      );
    }
  }

  /**
   * Register code node.
   * @param codeNode code node
   */
  registerCodeNode(codeNode?: AbstractCodeNode): void {
    this.logger.trace("register code node");

    if (!codeNode) return;
    this.codeNode = codeNode;

    this.codeNode.mask = this;
  }

  /**
   * Reset value in parameter components.
   * @remarks It emits node changes.
   */
  resetParams(): void {
    this.logger.trace("reset parameters");

    this.paramsAll.forEach((param: TParameter) => param.reset());
  }

  /**
   * Save parameters to state.
   * @return params state
   */
  override save(): Record<string, IParamState> {
    if (!this.params) return {};
    return Object.fromEntries(Object.entries(this.params).map(([paramKey, param]) => [paramKey, param.save()]));
  }

  /**
   * Sets all params to visible.
   * @param emitChanges option to emit changes.
   */
  showAllParams(emitChanges: boolean = true): void {
    this.paramsVisible = Object.keys(this._params);
    if (emitChanges) this.changes();
  }

  // updateParamsCodeNode(): void {
  //   this.params.forEach((param: BaseParameter) => {
  //     if (!param.intf) return;
  //     param.intf[param.id].setHidden(!this._paramsVisible.includes(param.id));
  //   });

  //   this.codeNode?.code?.onUpdate();
  // }

  updateCodeNode(values: string[]): void {
    Object.entries(this.paramInterfaces).forEach(([paramId, param]) => param.setHidden(!values.includes(paramId)));

    this._paramsVisible = Object.keys(this.codeNode.inputs).filter(
      (paramId) => paramId !== "_code" && !this.codeNode.inputs[paramId].hidden,
    );
  }
}
