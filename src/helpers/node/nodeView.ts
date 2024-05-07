// nodeView.ts

import { reactive, UnwrapRef } from "vue";

import { NodeRecord } from "./nodeRecord";
import { TConnection } from "@/types/connectionTypes";
import { TNode } from "@/types/nodeTypes";
import { BaseObj } from "../common/base";

export interface INodeViewProps {
  color?: string;
  elementType?: string;
  position: { x: number; y: number };
  visible?: boolean;
}

interface INodeViewState {
  color?: string;
  label?: string;
  position: { x: number; y: number };
  positions?: number[][];
  showSize: boolean;
  visible?: boolean;
  synWeights?: string;
}

export class NodeView extends BaseObj {
  public _node: TNode; // parent
  private _state: UnwrapRef<INodeViewState>;

  constructor(
    node: TNode,
    viewProps: INodeViewProps = {
      position: { x: 0, y: 0 },
      visible: true,
    }
  ) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._node = node;
    this._state = reactive({
      ...viewProps,
      label: "",
      positions: [],
      showSize: this.node.size > 1,
      synWeights: "",
    });
  }

  get color(): string {
    if (this._state.color) {
      return this._state.color;
    } else if (this.node.model.isRecorder) {
      const connections: TConnection[] =
        this.node.network.connections.all.filter(
          (connection: TConnection) =>
            connection.sourceIdx === this.node.idx ||
            connection.targetIdx === this.node.idx
        );
      if (
        connections.length === 1 &&
        connections[0].sourceIdx !== connections[0].targetIdx
      ) {
        const connection: TConnection = connections[0];
        const node: TNode =
          connection.sourceIdx === this.node.idx
            ? connection.targetNode
            : connection.sourceNode;
        return node.view.color;
      }
    }
    return this.node.network.getNodeColor(this.node.idx);
  }

  set color(value: string) {
    this._state.color = value === "none" || value === "" ? undefined : value;

    this.node.network.updateStyle();
    this.node.network.clean();
  }

  get label(): string {
    if (this._state.label) {
      return this._state.label;
    }

    let nodes: TNode[];
    let idx: number;
    let label: string;
    // let varname: string;

    switch (this.node.model.elementType) {
      case "neuron":
        nodes = this.node.nodes.neurons;
        idx = nodes.indexOf(this._node);
        label = "n" + (idx + 1);
        break;
      // case "stimulator":
      //   nodes = this.nodes.stimulators;
      //   idx = nodes.indexOf(this._node);
      //   varname = this._node.modelId.slice(0, this._node.modelId.length - 10);
      //   label = varname + (idx + 1);
      //   break;
      case undefined:
        nodes = this.node.nodes.nodeItems;
        idx = nodes.indexOf(this._node);
        label = "n" + (idx + 1);
        break;
      default:
        nodes = this.node.nodes.filterByModelId(this.node.modelId);
        idx = nodes.indexOf(this._node);
        label =
          this.node.model.abbreviation ||
          this.node.modelId
            .split("_")
            .map((d: string) => d[0])
            .join("");
        label += idx + 1;
    }

    return label;
  }

  get node(): TNode {
    return this._node;
  }

  get opacity(): boolean {
    const connections = this.node.nodes.network.connections;
    const nodes = this.node.nodes;
    return (
      true ||
      connections.state.selectedNode == null ||
      (connections.state.selectedNode != null &&
        this.node.state.isSelectedForConnection) ||
      (nodes.state.focusedNode != null && this.node.state.isFocused)
    );
  }

  get position(): { x: number; y: number } {
    return this._state.position;
  }

  get state(): UnwrapRef<INodeViewState> {
    return this._state;
  }

  /**
   * Get term based on synapse weight.
   */
  get synWeights(): string {
    return "excitatory";
  }

  /**
   * Clean node.
   */
  clean(): void {}

  /**
   * Get the record label.
   * @param recordId ID of the record
   */
  recordLabel(recordId: string): string {
    const recordables = this.node.recordables;
    const recordable = recordables.find(
      (recordable: NodeRecord) => recordable.id == recordId
    );
    if (recordable == undefined) {
      return recordId;
    }
    let label = `${recordable.label
      .slice(0, 1)
      .toUpperCase()}${recordable.label.slice(1)}`;
    if (recordable.unit) {
      label += ` (${recordable.unit})`;
    }
    return label;
  }

  /**
   * Serialize for JSON.
   * @return node view object
   */
  toJSON(): INodeViewProps {
    const nodeViewProps: INodeViewProps = {
      position: this._state.position,
    };

    if (this._state.color) {
      nodeViewProps.color = this._state.color;
    }

    return nodeViewProps;
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._updateHash({
      color: this.color,
      position: this._state.position,
    });
  }

  /**
   * Update element for node color.
   */
  updateStyle(): void {
    const root = document.documentElement;
    root.style.setProperty("--node" + this._node.idx + "-color", this.color);
  }
}
