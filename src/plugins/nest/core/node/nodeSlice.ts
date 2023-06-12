// nodeSlice.ts

import { Config } from "@/helpers/config";
import { Node } from "../node/node";
import { Parameter, parameterProps } from "../parameter";

export class NodeSlice extends Config {
  private readonly _name = "NodeSlice";
  private _node: Node;
  private _params: { [key: string]: Parameter } = {};
  private _visible: boolean = false;

  constructor(node: Node, params: parameterProps[] = []) {
    super("NodeSlice");
    this._node = node;
    this.initParameters(params);
    this._visible = params.length > 0;
  }

  get node(): Node {
    return this._node;
  }

  get visible(): boolean {
    return this._visible;
  }

  get name(): string {
    return this._name;
  }

  get params(): { [key: string]: Parameter } {
    return this._params;
  }

  toggleVisible(): void {
    this._visible = !this._visible;
  }

  /**
   * Initialize parameters.
   */
  initParameters(params: parameterProps[] = []): void {
    this._params = {};
    this.config.params.forEach((param: parameterProps) => {
      if (params.length > 0) {
        const p: parameterProps | undefined = params.find(
          (p: parameterProps) => p.id === param.id
        );
        if (p) {
          param.value = p.value;
          param.disabled = false;
        }
      }
      this._params[param.id] = new Parameter(this, param);
    });
  }

  /**
   * Get indices of node slicing
   */
  get indices(): string {
    if (Object.keys(this._params).length === 0) {
      return "";
    }

    const start: Parameter = this._params.start;
    const stop: Parameter = this._params.stop;
    const step: Parameter = this._params.step;

    if (start.disabled && stop.disabled && step.disabled) {
      return "";
    }

    const params: Parameter[] = [start, stop];
    if (!step.disabled) {
      params.push(step);
    }

    const indices = params.map((param: Parameter) =>
      param.disabled ? null : param.value
    );
    return `[${indices.join(":")}]`;
  }

  /**
   * Update node slice.
   */
  update(): void {
    if (this._params.stop.disabled) {
      this._params.stop.value = this._node.size;
    }
  }

  /**
   * Serialize for JSON.
   * @return node slice object
   */
  toJSON(): parameterProps[] {
    return Object.values(this._params)
      .filter((param: Parameter) => !param.disabled)
      .map((param: Parameter) => {
        return {
          id: param.id,
          value: param.value,
        };
      });
  }
}
