// codeNodeMask.ts

import type { AbstractCodeNode, CodeNodeInterface } from "@babsey/code-graph";

import { BaseObj, type IBaseObjProps } from "@/core";

export abstract class CodeNodeMask<T = unknown | null> extends BaseObj<T> {
  public codeNode: AbstractCodeNode | undefined;

  constructor(props?: IBaseObjProps) {
    super(props);
  }

  get intf(): Record<string, CodeNodeInterface> | undefined {
    return this.codeNode?.inputs;
  }

  /**
   * Register code node.
   * @param codeNode code node
   */
  registerCodeNode(codeNode?: AbstractCodeNode): void {
    this.logger.trace("register code node");

    this.codeNode = codeNode;
    this.codeNode.mask = this;
  }

  /**
   * Unregister code node.
   */
  unregisterCodeNode(): void {
    this.logger.trace("unregister code node");

    this.codeNode.mask = undefined;
    this.codeNode = undefined;
  }
}
