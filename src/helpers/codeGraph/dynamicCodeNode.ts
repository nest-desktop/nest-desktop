// dynamicCodeNode.ts

import {
  INodeState,
  NodeInterface,
  NodeInterfaceDefinition,
  InterfaceFactory,
  IDynamicNodeDefinition,
  IntegerInterface,
  TextInputInterface,
  displayInSidebar,
} from "baklavajs";

import { AbstractCodeNode, CodeNode } from "./codeNode";
import { BaseCode } from "../code/code";
import { NodeOutputInterface } from "./interface/nodeOutputInterface";
import { truncate } from "@/utils/truncate";

type Dynamic<T> = T & Record<string, any>;

/**
 * @internal
 * Abstract base class for every dynamic node
 */
export abstract class DynamicCodeNode<I, O> extends CodeNode<Dynamic<I>, Dynamic<O>> {
  public abstract inputs: NodeInterfaceDefinition<Dynamic<I>>;
  public abstract outputs: NodeInterfaceDefinition<Dynamic<O>>;

  public abstract load(state: INodeState<Dynamic<I>, Dynamic<O>>): void;

  /**
   * The default implementation does nothing.
   * Overwrite this method to do calculation.
   * @param inputs Values of all input interfaces
   * @param globalValues Set of values passed to every node by the engine plugin
   * @return Values for output interfaces
   */
  // public calculate?: CalculateFunction<Dynamic<I>, Dynamic<O>>;
}

export type DynamicNodeDefinition = Record<string, (() => NodeInterface<any>) | undefined>;
export interface DynamicNodeUpdateResult {
  inputs?: DynamicNodeDefinition;
  outputs?: DynamicNodeDefinition;
  forceUpdateInputs?: string[];
  forceUpdateOutputs?: string[];
}

export interface IDynamicCodeNodeDefinition<I, O> extends IDynamicNodeDefinition<I, O> {
  code?: BaseCode;
  codeTemplate?: (node?: AbstractCodeNode) => string;
  node?: AbstractCodeNode;
  modules?: string[];
  onGraphUpdate?: (node?: AbstractCodeNode) => void;
  onProjectUpdate?: (node?: AbstractCodeNode) => void;
  toJSON?: (node?: AbstractCodeNode) => Record<string, unknown>;
  variableName?: string;
}

export function defineDynamicCodeNode<I, O>(
  definition: IDynamicCodeNodeDefinition<I, O>,
): new () => DynamicCodeNode<I, O> {
  return class extends DynamicCodeNode<I, O> {
    public readonly type = definition.type;
    public inputs = {} as NodeInterfaceDefinition<Dynamic<I>>;
    public outputs = {} as NodeInterfaceDefinition<Dynamic<O>>;
    public calculate;

    private preventUpdate = false;
    private readonly staticInputKeys = Object.keys(definition.inputs ?? {});
    private readonly staticOutputKeys = Object.keys(definition.outputs ?? {});

    constructor() {
      super();
      this.logger.settings.name = `[${truncate(this.id)}] ${definition.type}`;
      // this.logger.settings.minLevel = 1;

      this._title = definition.title ?? definition.type;

      if (definition.modules) this.modules = definition.modules;
      if (definition.variableName) this.variableName = definition.variableName;

      this.staticInputKeys.push("prev");
      this.staticOutputKeys.push("next");
      this.addInput("prev", new NodeInterface("", "").setHidden(true));
      this.addOutput("next", new NodeInterface("", "").setHidden(true));

      this.executeFactory("input", definition.inputs);
      this.executeFactory("output", definition.outputs);

      if (definition.calculate) {
        this.calculate = (inputs: Dynamic<I>, globalValues: any) =>
          definition.calculate?.call(this, inputs, globalValues);
      }

      definition.onCreate?.call(this);
    }

    override get codeTemplate(): string {
      return this.state.codeTemplate || (definition.codeTemplate?.call(this) as string);
    }

    override set codeTemplate(value: string) {
      this.state.codeTemplate = value;
      this.onChange();
    }

    public onPlaced() {
      this.logger.trace("on placed");

      this.events.update.subscribe(this, (data) => {
        if (!data) return;

        if (
          (data.type === "input" && this.staticInputKeys.includes(data.name)) ||
          (data.type === "output" && this.staticOutputKeys.includes(data.name))
        ) {
          this.onUpdate();
        }
      });
      this.onUpdate();

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

    public load(state: INodeState<Dynamic<I>, Dynamic<O>>): void {
      // prevent automatic updates during loading
      this.preventUpdate = true;

      this.hooks.beforeLoad.execute(state);
      this.id = state.id;
      this.title = state.title;

      // first load the state for the static interfaces
      for (const k of this.staticInputKeys) {
        this.inputs[k].load(state.inputs[k]);
        this.inputs[k].nodeId = this.id;
        this.inputs[k].hidden = state.inputs[k].hidden;
      }
      for (const k of this.staticOutputKeys) {
        this.outputs[k].load(state.outputs[k]);
        this.outputs[k].nodeId = this.id;
        this.outputs[k].hidden = state.outputs[k].hidden;
      }

      // run the update function to correctly generate all interfaces
      this.preventUpdate = false;
      this.onUpdate();
      this.preventUpdate = true;

      // load the state for all generated interfaces
      for (const k of Object.keys(state.inputs)) {
        if (this.staticInputKeys.includes(k)) continue;

        if (!this.inputs[k]) {
          const value = state.inputs[k].value;
          let inputInterface;
          if (typeof value == "number") {
            inputInterface = new IntegerInterface(k, value as number);
          } else {
            inputInterface = new TextInputInterface(k, JSON.stringify(value));
          }
          inputInterface.use(displayInSidebar, true);
          this.addInput(k, inputInterface);
        }

        if (this.inputs[k]) {
          this.inputs[k].load(state.inputs[k]);
          this.inputs[k].nodeId = this.id;
          this.inputs[k].hidden = state.inputs[k].hidden;
        }
      }
      for (const k of Object.keys(state.outputs)) {
        if (this.staticOutputKeys.includes(k)) continue;

        if (!this.outputs[k]) {
          const outputInterface = new NodeOutputInterface(k);
          this.addOutput(k, outputInterface);
        }

        if (this.outputs[k]) {
          this.outputs[k].load(state.outputs[k]);
          this.outputs[k].nodeId = this.id;
          this.outputs[k].hidden = state.outputs[k].hidden;
        }
      }

      this.preventUpdate = false;
      this.events.loaded.emit(this as any);
    }

    private onUpdate() {
      this.logger.trace("on update");
      if (this.preventUpdate) return;

      if (this.graph) this.graph.activeTransactions++;

      const inputValues = this.getStaticValues<I>(this.staticInputKeys, this.inputs);
      const outputValues = this.getStaticValues<O>(this.staticOutputKeys, this.outputs);
      const result = definition.onUpdate.call(this, inputValues, outputValues);
      this.updateInterfaces("input", result.inputs ?? {}, result.forceUpdateInputs ?? []);
      this.updateInterfaces("output", result.outputs ?? {}, result.forceUpdateOutputs ?? []);

      if (this.graph) this.graph.activeTransactions--;

      this.renderCode();
    }

    private getStaticValues<T>(keys: string[], interfaces: Record<string, NodeInterface>): T {
      const values = {} as Record<string, any>;
      for (const k of keys) {
        values[k] = interfaces[k].value;
      }
      return values as T;
    }

    private updateInterfaces(type: "input" | "output", newInterfaces: DynamicNodeDefinition, forceUpdates: string[]) {
      const staticKeys = type === "input" ? this.staticInputKeys : this.staticOutputKeys;
      const currentInterfaces = type === "input" ? this.inputs : this.outputs;

      // remove all interfaces that are outdated
      for (const k of Object.keys(currentInterfaces)) {
        if (staticKeys.includes(k) || (newInterfaces[k] && !forceUpdates.includes(k))) continue;

        if (type === "input") {
          this.removeInput(k);
        } else {
          this.removeOutput(k);
        }
      }

      // add all new interfaces
      for (const k of Object.keys(newInterfaces)) {
        if (currentInterfaces[k]) continue;

        const intf = newInterfaces[k]!();
        if (type === "input") {
          this.addInput(k, intf);
        } else {
          this.addOutput(k, intf);
        }
      }
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

    override toJSON(): Record<string, unknown> {
      return definition.toJSON ? definition.toJSON?.call(this) : this._toJSON();
    }
  };
}
