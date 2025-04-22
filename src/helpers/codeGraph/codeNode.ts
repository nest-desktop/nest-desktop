// codeNode.ts
// Adapted from https://github.com/newcat/baklavajs/blob/987018200389bd86c48544ac4afa7a393fe1e9bc/packages/core/src/node.ts

import Mustache from "mustache";
import { AbstractNode, Connection, INodeState, NodeInterface, NodeInterfaceDefinition } from "baklavajs";

import { nextTick, reactive, UnwrapRef } from "vue";

import { BaseCode } from "../code/code";
import { TConnection, TSimulation } from "@/types";
import { NodeOutputInterface } from "./interface/nodeOutputInterface";

// export function mapValues<I, O>(obj: Record<string, I>, fn: (value: I) => O): Record<string, O> {
//   return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]));
// }

// export interface ICodeNodeState<I, O> extends INodeState<I, O> {
//   next: INodeInterfaceState<any>;
//   prev: INodeInterfaceState<any>;
// }

interface IAbstractCodeNodeState {
  codeTemplate: string;
  commented: boolean;
  comments: string;
  hidden: boolean;
  integrated: boolean;
  role: string;
  script: string;
  token: symbol | null;
}

export abstract class AbstractCodeNode extends AbstractNode {
  abstract inputs: Record<string, NodeInterface<any>>;
  abstract outputs: Record<string, NodeInterface<any>>;

  private _code: BaseCode | undefined;
  private _networkItem: unknown | undefined;
  private _simulationItem: TSimulation | undefined;
  private _state: UnwrapRef<IAbstractCodeNodeState> = reactive({
    codeTemplate: "",
    commented: false,
    comments: "",
    hidden: false,
    integrated: false,
    role: "",
    script: "",
    token: null,
  });

  public modules: string[] = [];
  public variableName: string = "x";

  constructor() {
    super();

    this.twoColumn = true;

    // this.initializeIo();
  }

  get code(): BaseCode | undefined {
    return this._code;
  }

  set code(value: BaseCode) {
    this._code = value;
  }

  abstract get codeTemplate(): string;

  abstract set codeTemplate(value: string);

  get idx(): number {
    return this.code?.graph?.nodesSegregated.indexOf(this) ?? -1;
  }

  get idxByVariableNames(): number {
    return this.code?.graph?.getNodesBySameVariableNames(this.variableName).indexOf(this) ?? -1;
  }

  get indexOfNodeType(): number {
    const nodeIds = this.code?.graph.nodesSegregated
      .filter((node: AbstractCodeNode) => node.type === this.type)
      .map((node: AbstractCodeNode) => node.id);
    if (nodeIds) return nodeIds.indexOf(this.id);
    return -1;
  }

  get label(): string {
    return this.variableName + (this.idxByVariableNames + 1);
  }

  get module(): string {
    if (!this.type.includes(".")) return "";
    const modules = this.type.split(".");
    return modules.slice(0, modules.length - 1).join(".");
  }

  get nOutputs(): number {
    return Object.keys(this.outputs).length;
  }

  get nInputs(): number {
    return Object.keys(this.inputs).length;
  }

  get networkItem(): unknown | undefined {
    return this._networkItem;
  }

  set networkItem(value: unknown) {
    this._networkItem = value;
  }

  get node(): AbstractCodeNode {
    return this;
  }

  get script(): string {
    return this._state.script;
  }

  get simulationItem(): TSimulation | undefined {
    return this._simulationItem;
  }

  set simulationItem(value: TSimulation | TConnection) {
    this._simulationItem = value;
  }

  get state(): UnwrapRef<IAbstractCodeNodeState> {
    return this._state;
  }

  // calculate?: CalculateFunction<any, any> | undefined;

  /**
   * Get connected node interface to the node interface.
   * @param nodeInterface string
   * @returns interface instance
   */
  getConnectedInterfaceByInterface(nodeInterface: string): NodeInterface[] {
    let nodeInterfaces: NodeInterface[] = [];

    if (nodeInterface in this.inputs) {
      const sources = this.graph?.connections
        .filter(
          (c: Connection) => c.to.id === this.inputs[nodeInterface].id || c.from.id === this.inputs[nodeInterface].id,
        )
        .map((c: Connection) => c.from);
      if (sources) nodeInterfaces = nodeInterfaces.concat(sources);
    }
    if (nodeInterface in this.outputs) {
      const targets = this.graph?.connections
        .filter(
          (c: Connection) =>
            c.from.id === this.outputs[nodeInterface].id || c.from.id === this.outputs[nodeInterface].id,
        )
        .map((c: Connection) => c.to);
      if (targets) nodeInterfaces = nodeInterfaces.concat(targets);
    }

    return nodeInterfaces;
  }

  /**
   * Get connected nodes to the node.
   */
  getConnectedNodes(mode?: string): AbstractCodeNode[] {
    let nodeIds: string[] = [];

    if (mode !== "inputs") {
      const targets = this.graph?.connections
        .filter((c: Connection) => c.from.constructor.name === "NodeOutputInterface")
        .filter((c: Connection) => c.from.nodeId === this.id)
        .map((c: Connection) => c.to.nodeId);
      if (targets) nodeIds = nodeIds.concat(targets);
    }

    if (mode !== "outputs") {
      const sources = this.graph?.connections
        .filter((c: Connection) => c.to.nodeId === this.id)
        .map((c: Connection) => c.from.nodeId);

      if (sources) nodeIds = nodeIds.concat(sources);
    }

    if (!nodeIds || nodeIds.length == 0) return [];
    return nodeIds.map((nodeId: string) => this.graph?.findNodeById(nodeId)) as AbstractCodeNode[];
  }

  /**
   * Get connected node to the node interface.
   * @param nodeInterface string
   * @returns code node instance
   */
  getConnectedNodesByInterface(nodeInterface: string): AbstractCodeNode[] {
    let nodeIds: string[] = [];

    if (nodeInterface in this.inputs) {
      const sources = this.graph?.connections
        .filter(
          (c: Connection) => c.to.id === this.inputs[nodeInterface].id || c.from.id === this.inputs[nodeInterface].id,
        )
        .map((c: Connection) => c.from.nodeId);
      if (sources) nodeIds = nodeIds.concat(sources);
    }
    if (nodeInterface in this.outputs) {
      const targets = this.graph?.connections
        .filter(
          (c: Connection) =>
            c.from.id === this.outputs[nodeInterface].id || c.from.id === this.outputs[nodeInterface].id,
        )
        .map((c: Connection) => c.to.nodeId);
      if (targets) nodeIds = nodeIds.concat(targets);
    }

    if (!nodeIds || nodeIds.length == 0) return [];
    return nodeIds.map((nodeId) => this.graph?.findNodeById(nodeId)) as AbstractCodeNode[];
  }

  /**
   * Get connected node output interface to the node interface.
   * @param nodeInterface string
   * @returns node output interface instance
   */
  getConnectedOutputInterfaceByInterface(nodeInterface: string): NodeOutputInterface[] {
    let nodeInterfaces: NodeOutputInterface[] = [];

    if (nodeInterface in this.inputs) {
      const sources = this.graph?.connections
        .filter((c: Connection) => c.from.constructor.name === "NodeOutputInterface")
        .filter(
          (c: Connection) => c.to.id === this.inputs[nodeInterface].id || c.from.id === this.inputs[nodeInterface].id,
        )
        .map((c: Connection) => c.from) as NodeOutputInterface[];
      if (sources) nodeInterfaces = nodeInterfaces.concat(sources);
    }

    return nodeInterfaces;
  }

  onChange(): void {
    console.log("on change");
    this.renderCode();

    nextTick(() => {
      this.code?.renderCode();
      this.code?.updateHash();
    });
  }

  /**
   * Render code of this node.
   */
  renderCode(): void {
    this._state.script = Mustache.render(this.codeTemplate, this.toJSON());
    if (this.getConnectedNodes("outputs").length > 0) {
      this._state.script = `${this.label} = ${this._state.script}`;
    }

    if (this._state.commented) {
      this._state.script = `# ${this._state.script}`;
      this._state.script = this._state.script.replaceAll("\n", "\n# ");
    }

    if (this._state.comments) {
      this._state.script = `\n# ${this._state.comments}\n${this._state.script}`;
    }
  }

  // override save(): ICodeNodeState<any, any> {
  //   const inputStates = mapValues(this.inputs, (intf: NodeInterface) =>
  //     intf.save(),
  //   ) as NodeInterfaceDefinitionStates<any>;
  //   const outputStates = mapValues(this.outputs, (intf: NodeInterface) =>
  //     intf.save(),
  //   ) as NodeInterfaceDefinitionStates<any>;

  //   const state: ICodeNodeState<any, any> = {
  //     type: this.type,
  //     id: this.id,
  //     title: this.title,
  //     inputs: inputStates,
  //     outputs: outputStates,
  //     next: this.next.save(),
  //     prev: this.prev.save(),
  //   };
  //   return this.hooks.afterSave.execute(state) as ICodeNodeState<any, any>;
  // }

  // subscribe(): void {
  //   if (this.state.token) this.unsubscribe();

  //   this.state.token = Symbol("token");
  //   this.code?.graph.graph.editor.nodeEvents.update.subscribe(this.state.token, () => this.onChange());
  // }

  // unsubscribe(): void {
  //   if (!this.state.token) return;

  //   this.code?.graph.graph.editor.nodeEvents.update.unsubscribe(this.state.token);
  //   this.state.token = null;
  // }

  toJSON(): Record<string, unknown> {
    return this._toJSON();
  }

  _toJSON(): Record<string, unknown> {
    const props: Record<string, unknown> = {};

    if (this.node && this.node.nInputs > 0) {
      Object.entries(this.node?.inputs).forEach((input) => {
        if (!input[1].hidden && input[1].value != null) props[input[0]] = input[1].value;
      });
    }

    return props;
  }
}

export abstract class CodeNode<I, O> extends AbstractCodeNode {
  abstract inputs: NodeInterfaceDefinition<I>;
  abstract outputs: NodeInterfaceDefinition<O>;

  public load(state: INodeState<I, O>): void {
    super.load(state);
  }

  public save(): INodeState<I, O> {
    return super.save();
  }
  /**
   * The default implementation does nothing.
   * Overwrite this method to do calculation.
   * @param inputs Values of all input interfaces
   * @param globalValues Set of values passed to every node by the engine plugin
   * @return Values for output interfaces
   */
  // public calculate?: CalculateFunction<I, O>;
}

export type AbstractCodeNodeConstructor = new () => AbstractCodeNode;
