// codeMaskParameter.ts

import type { AbstractCodeNode, CodeNodeInterface } from "@babsey/code-graph";

import { BaseParameter, type BaseParameters, type TParamValue, type IParamState } from "@/parameter";

export interface ICodeMaskParamState extends IParamState {
  codeNodeInterface?: string;
}

export class CodeMaskParameter<
  TParent extends BaseParameters = BaseParameters,
  TState extends ICodeMaskParamState = ICodeMaskParamState,
> extends BaseParameter<TParent, TState> {
  get codeNode(): AbstractCodeNode | undefined {
    return this.parent?.codeNode;
  }

  get intf(): CodeNodeInterface | undefined {
    if (this.codeNode) return this.codeNode.inputs[this.id];
  }

  override get hidden(): boolean {
    return this.intf?.hidden ?? this.state.hidden;
  }

  override set hidden(value: boolean) {
    this.state.hidden = value;
    if (this.intf) this.intf.setHidden(value);
  }

  override get value(): TParamValue {
    return this.intf ? (this.intf.value as TParamValue) : this.state.value;
  }

  override set value(value: TParamValue) {
    this.state.value = value;
    if (this.intf) this.intf.value = value;

    if (this.props?.value?.handleOnUpdate) this.props.value.handleOnUpdate(this);
  }

  /**
   * Copy parameter instance.
   */
  override copy(): CodeMaskParameter<TParent> {
    const param = new CodeMaskParameter<TParent>(this.parent);
    param.load(this.save());
    return param;
  }
}
