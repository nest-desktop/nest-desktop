// defineCodeNode.ts
// Adapted from https://github.com/newcat/baklavajs/blob/987018200389bd86c48544ac4afa7a393fe1e9bc/packages/core/src/defineNode.ts

import { Node, NodeInterface, NodeInterfaceDefinition, INodeDefinition } from "baklavajs";

import { AbstractCodeNode, CodeNode } from "./codeNode";
import { BaseCode } from "../code/code";

export type NodeConstructor<I, O> = new () => Node<I, O>;
export type NodeInstanceOf<T> = T extends new () => Node<infer A, infer B> ? Node<A, B> : never;

export type NodeInterfaceFactory<T> = () => NodeInterface<T>;
export type InterfaceFactory<T> = {
  [K in keyof T]: NodeInterfaceFactory<T[K]>;
};

export interface ICodeNodeDefinition<I, O> extends INodeDefinition<I, O> {
  code?: BaseCode;
  codeTemplate?: (node?: AbstractCodeNode) => string;
  modules?: string[];
  node?: AbstractCodeNode;
  toJSON?: (node?: AbstractCodeNode) => Record<string, unknown>;
  variableName?: string;
}

export function defineCodeNode<I, O>(definition: ICodeNodeDefinition<I, O>): new () => CodeNode<I, O> {
  return class extends CodeNode<I, O> {
    public readonly type = definition.type;
    public inputs: NodeInterfaceDefinition<I> = {} as NodeInterfaceDefinition<I>;
    public outputs: NodeInterfaceDefinition<O> = {} as NodeInterfaceDefinition<O>;

    constructor() {
      super();
      this._title = definition.title ?? definition.type;
      if (definition.modules) this.modules = definition.modules;
      if (definition.variableName) this.variableName = definition.variableName;

      this.addInput("prev", new NodeInterface("", "").setHidden(true));
      this.addOutput("next", new NodeInterface("", "").setHidden(true));
      this.executeFactory("input", definition.inputs);
      this.executeFactory("output", definition.outputs);
      definition.onCreate?.call(this);
    }

    public calculate = definition.calculate
      ? (inputs: I, globalValues: any) => {
          return definition.calculate!.call(this, inputs, globalValues);
        }
      : undefined;

    override get codeTemplate(): string {
      return this.state.codeTemplate || (definition.codeTemplate?.call(this) as string);
    }

    override set codeTemplate(value: string) {
      this.state.codeTemplate = value;
      this.onChange();
    }

    public onPlaced() {
      definition.onPlaced?.call(this);
    }

    public onDestroy() {
      definition.onDestroy?.call(this);
    }

    override toJSON(): Record<string, unknown> {
      return definition.toJSON ? definition.toJSON?.call(this) : this._toJSON();
    }

    private executeFactory<V, T extends InterfaceFactory<V>>(type: "input" | "output", factory?: T): void {
      (Object.keys(factory || {}) as (keyof V)[]).forEach((k) => {
        const intf = factory![k]();
        if (type === "input") {
          this.addInput(k as string, intf);
        } else {
          this.addOutput(k as string, intf);
        }
      });
    }
  };
}
