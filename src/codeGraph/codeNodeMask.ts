// codeNodeMask.ts

import { ref, type Ref } from "vue";
import type { AbstractCodeNode, CodeNodeInterface } from "@babsey/code-graph";

import { BaseObj, type IBaseObjProps } from "../helpers/common/base";

export abstract class CodeNodeMask extends BaseObj {
  public codeNode: AbstractCodeNode | undefined;
  public props: Ref<unknown | null | undefined> = ref();

  constructor(props?: IBaseObjProps) {
    super(props);
  }

  get intf(): Record<string, CodeNodeInterface> | undefined {
    return this.codeNode?.inputs;
  }

  abstract registerCodeNode(codeNode?: AbstractCodeNode): void;
}
