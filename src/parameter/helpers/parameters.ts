// parameters.ts

import type { AbstractCodeNode, CodeNodeInterface } from "@babsey/code-graph";

import type { Class } from "@/types";
import { CodeNodeMask } from "@/codeGraph/helpers/codeNodeMask";

import { BaseParameter, type IParamState } from "./parameter";

export class BaseParameters<
  TParameter extends BaseParameter = BaseParameter,
  TState extends Record<string, IParamState> = Record<string, IParamState>,
> extends CodeNodeMask<TState> {
  private _params: Record<string, TParameter> = {};

  get Parameter(): Class<BaseParameter> {
    return BaseParameter;
  }

  get entries(): [string, TParameter][] {
    return Object.entries(this.params);
  }

  get filteredParams(): TParameter[] {
    return this.visibleParamIds
      .filter((paramId: string) => this.params[paramId])
      .map((paramId: string) => this.params[paramId]);
  }

  get hasSomeVisibleParams(): boolean {
    return this.visibleParamIds.length > 0;
  }

  get modelParams(): this {
    return this;
  }

  get paramInterfaces(): Record<string, CodeNodeInterface> {
    if (!this.codeNode) return {};
    return Object.fromEntries(Object.entries(this.codeNode.inputs).filter((intf) => this.keys.includes(intf[0])));
  }

  get keys(): string[] {
    return Object.keys(this._params);
  }

  get params(): Record<string, TParameter> {
    return this._params;
  }

  get values(): TParameter[] {
    return Object.values(this.params);
  }

  get visibleParamIds(): string[] {
    return this.values.filter((param: TParameter) => !param.hidden).map((param: TParameter) => param.id);
  }

  set visibleParamIds(values: string[]) {
    this.values.forEach((param: TParameter) => (param.hidden = !values.includes(param.id)));

    this.codeNode.code.engine.runOnce();
  }

  /**
   * Add parameter component.
   * @param paramState parameter state
   * @param visible boolean
   */
  addParameter(paramState: IParamState, visible: boolean = false): void {
    this.logger.trace("add parameter", paramState.id);

    const param = new this.Parameter(this) as TParameter;
    param.load(paramState);
    this.params[paramState.id] = param;

    if (visible) this.visibleParamIds.push(paramState.id);
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
  }

  /**
   * Get parameter instance.
   * @param paramId parameter ID
   * @return parameter instance
   */
  get(paramId: string): TParameter | undefined {
    return this.params[paramId];
  }

  /**
   * Check if it has parameter component.
   * @param paramId parameter ID
   */
  hasParameter(paramId: string): boolean {
    return this.keys.some((paramKey: string) => paramKey === paramId);
  }

  /**
   * Sets all params to invisible.
   */
  hideAll(emitChanges: boolean = true): void {
    this.values.forEach((param: TParameter) => param.hide());
    if (emitChanges) this.changes();
  }

  init(): void {}

  /**
   * Load parameters from state.
   * @return params state
   */
  load(paramStates: TState) {
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
  reset(): void {
    this.logger.trace("reset parameters");

    this.values.forEach((param: TParameter) => param.reset());
  }

  /**
   * Save parameters to state.
   * @return params state
   */
  override save(): TState {
    if (!this.params) return {} as TState;
    return Object.fromEntries(
      Object.entries(this.params).map(([paramKey, param]) => [paramKey, param.save()]),
    ) as TState;
  }

  /**
   * Sets all params to visible.
   * @param emitChanges option to emit changes.
   */
  showAll(emitChanges: boolean = true): void {
    this.values.forEach((param: TParameter) => param.show());
    if (emitChanges) this.changes();
  }
}
