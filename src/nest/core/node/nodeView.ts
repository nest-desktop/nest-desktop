// nodeView.ts

import { reactive, UnwrapRef } from "vue";
import { sha1 } from "object-hash";

import { Connection } from "../connection/connection";
import { CopyModel } from "../model/copyModel";
import { Node } from "./node";
import { Nodes } from "./nodes";
import { Connections } from "../connection/connections";
import { Network } from "../network/network";
import { CopyModels } from "../model/copyModels";

export interface NodeViewProps {
  position: { [key: string]: number };
  color?: string;
  visible?: boolean;
}

interface NodeViewState {
  hash: string;
  color?: string;
  position: { [key: string]: number };
  visible?: boolean;
}

export class NodeView {
  private _label: string = "";
  private _node: Node; // parent
  private _positions: number[][] = [];
  private _state: UnwrapRef<NodeViewState>;

  constructor(
    node: Node,
    view: NodeViewProps = {
      position: { x: 0, y: 0 },
      visible: true,
    }
  ) {
    this._node = node;

    this._state = reactive({
      hash: "",
      ...view,
    });
  }

  get color(): string {
    if (this._state.color) {
      return this._state.color;
    } else if (this._node.model.isWeightRecorder) {
      const models = this._node.assignedModels;
      if (models.length === 1) {
        const connection = models[0].connections[0];
        return connection.source.view.color;
      }
    } else if (this._node.model.isRecorder) {
      const connections: Connection[] = this._node.network.connections.filter(
        (connection: Connection) =>
          connection.sourceIdx === this._node.idx ||
          connection.targetIdx === this._node.idx
      );
      if (
        connections.length === 1 &&
        connections[0].sourceIdx !== connections[0].targetIdx
      ) {
        const connection: Connection = connections[0];
        const node: Node =
          connection.sourceIdx === this._node.idx
            ? connection.target
            : connection.source;
        return node.view.color;
      }
    }
    return this._node.network.getNodeColor(this._node.idx);
  }

  set color(value: string) {
    this._state.color = value === "none" || value === "" ? undefined : value;
    this._node.network.clean();
  }

  get connections(): Connections {
    return this.network.connections;
  }

  get label(): string {
    if (this._label) {
      return this._label;
    }

    let nodes: Node[];
    let idx: number;
    let label: string;
    // let varname: string;

    switch (this._node.model.elementType) {
      case "neuron":
        nodes = this.nodes.neurons;
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
        nodes = this.nodes.all;
        idx = nodes.indexOf(this._node);
        label = "n" + (idx + 1);
        break;
      default:
        nodes = this.nodes.filterByModelId(this._node.modelId);
        idx = nodes.indexOf(this._node);
        label =
          this._node.model.abbreviation ||
          this._node.modelId
            .split("_")
            .map((d: string) => d[0])
            .join("");
        label += idx + 1;
    }

    return label;
  }

  get models(): CopyModels {
    return this.network.models;
  }

  get network(): Network {
    return this._node.network;
  }

  get node(): Node {
    return this._node;
  }

  get nodes(): Nodes {
    return this._node.nodes;
  }

  get position(): { [key: string]: number } {
    return this._state.position;
  }

  get positions(): number[][] {
    return this._positions;
  }

  set positions(value: number[][]) {
    this._positions = value;
  }

  get visible(): boolean {
    return this._state.visible || false;
  }

  set visible(value: boolean) {
    this._state.visible = value;
  }

  /**
   * Get term based on synapse weight.
   */
  get weight(): string {
    if (this._node.model.isRecorder) {
      return "";
    }
    const connections: Connection[] = this.connections.filter(
      (connection: Connection) =>
        connection.source.idx === this._node.idx &&
        !connection.target.model.isRecorder
    );
    if (connections.length > 0) {
      const weights: number[] = connections.map(
        (connection: Connection) => connection.synapse.weight
      );
      if (weights.every((weight: number) => weight > 0)) {
        return "excitatory";
      }
      if (weights.every((weight: number) => weight < 0)) {
        return "inhibitory";
      }
      return "mixed";
    }
    return "";
  }

  /**
   * Clean node.
   */
  clean(): void {
    const cleanWeightRecorder = false;
    if (this.node.model.isWeightRecorder && cleanWeightRecorder) {
      const copiedSynapseModels = this.models.synapseModels.filter(
        (model: CopyModel) => model.isAssignedToWeightRecorder(this.node)
      );
      if (copiedSynapseModels.length === 1) {
        const copiedSynapseModel = copiedSynapseModels[0];
        const connection = this.connections.getBySynapseModelId(
          copiedSynapseModel.id
        );
        if (connection) {
          this._state.position = connection.view.position;
        }
      }
    }
  }

  /**
   * Get the record label.
   * @param recordId ID of the record
   */
  recordLabel(recordId: string): string {
    const recordables = this._node.recordables;
    const recordable = recordables.find(
      (recordable) => recordable.id == recordId
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
  toJSON(): NodeViewProps {
    const nodeView: NodeViewProps = {
      position: this._state.position,
    };

    if (this._state.color) {
      nodeView.color = this._state.color;
    }
    return nodeView;
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._state.hash = sha1({
      color: this.color,
      position: this._state.position,
    });
  }
}
