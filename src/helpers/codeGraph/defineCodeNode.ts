// defineCodeNode.ts
// Adapted from https://github.com/newcat/baklavajs/blob/987018200389bd86c48544ac4afa7a393fe1e9bc/packages/core/src/defineNode.ts

import { Node, NodeInterface, NodeInterfaceDefinition, INodeDefinition, setType } from "baklavajs";

import { truncate } from "@/utils/truncate";

import { AbstractCodeNode, CodeNode } from "./codeNode";
import { BaseCode } from "../code/code";
import { nodeType } from "../codeNodeTypes/base/interfaceTypes";

export type NodeConstructor<I, O> = new () => Node<I, O>;
export type NodeInstanceOf<T> = T extends new () => Node<infer A, infer B> ? Node<A, B> : never;

export type NodeInterfaceFactory<T> = () => NodeInterface<T>;
export type InterfaceFactory<T> = {
  [K in keyof T]: NodeInterfaceFactory<T[K]>;
};

export interface ICodeNodeDefinition<I, O> extends INodeDefinition<I, O> {
  code?: BaseCode;
  codeTemplate?: (node?: AbstractCodeNode) => string;
  node?: AbstractCodeNode;
  modules?: string[];
  onGraphUpdate?: (node?: AbstractCodeNode) => void;
  onProjectUpdate?: (node?: AbstractCodeNode) => void;
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
      this.logger.settings.name = `[${truncate(this.id)}] ${definition.type}`;
      // this.logger.settings.minLevel = 1;

      this._title = definition.title ?? definition.type;
      if (definition.modules) this.modules = definition.modules;
      if (definition.variableName) this.variableName = definition.variableName;

      this.addInput("_node", new NodeInterface("", null).use(setType, nodeType).setHidden(true));
      this.addOutput("_node", new NodeInterface("", null).use(setType, nodeType).setHidden(true));
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
      this.events.update.emit(null);
    }

    public onPlaced() {
      this.logger.trace("on placed");
      definition.onPlaced?.call(this);
    }

    public onDestroy() {
      this.logger.trace("on destroy");
      definition.onDestroy?.call(this);
    }

    public onGraphUpdate() {
      this.logger.trace("on graph update");
      definition.onGraphUpdate?.call(this);
    }

    public onProjectUpdate() {
      this.logger.trace("on network update");
      definition.onProjectUpdate?.call(this);
    }

    override toJSON(): Record<string, unknown> {
      return definition.toJSON ? definition.toJSON?.call(this) : super.toJSON();
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
