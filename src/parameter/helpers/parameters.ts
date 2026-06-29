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
      .map((paramId: string) => this.params[paramId]) as TParameter[];
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
    this.codeNode?.code?.engine?.runOnce({});
  }

  /**
   * Add parameter component.
   * @param paramState parameter state
   */
  addParameter(paramState?: IParamState): void {
    this.logger.trace("add parameter", paramState?.id);

    const param = new this.Parameter(this) as TParameter;
    if (paramState) param.load(paramState);
    this.params[param.id] = param;
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
  hideAll(): void {
    this.values.forEach((param: TParameter) => param.hide());
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
        this.addParameter({ ...param, id: paramKey }),
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
   */
  showAll(): void {
    this.values.forEach((param: TParameter) => param.show());
  }
}
