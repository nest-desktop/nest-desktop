// nestNodeView.ts

import { reactive, UnwrapRef } from "vue";
import { sha1 } from "object-hash";

import { NESTConnection } from "@nest/components/connection/nestConnection";
import { NESTCopyModel } from "@nest/components/model/nestCopyModel";

import { NESTNode } from "./nestNode";

export interface NESTNodeViewProps {
  position: { x: number; y: number };
  color?: string;
  visible?: boolean;
}

interface NESTNodeViewState {
  color?: string;
  hash: string;
  label?: string;
  position: { x: number; y: number };
  positions?: number[][];
  showSize: boolean;
  visible?: boolean;
  synWeights?: string;
}

export class NESTNodeView {
  private _node: NESTNode; // parent
  private _state: UnwrapRef<NESTNodeViewState>;

  constructor(
    node: NESTNode,
    view: NESTNodeViewProps = {
      position: { x: 0, y: 0 },
      visible: true,
    }
  ) {
    this._node = node;

    this._state = reactive({
      ...view,
      hash: "",
      label: "",
      positions: [],
      showSize: node.size > 1,
      synWeights: "",
    });
  }

  get color(): string {
    if (this._state.color) {
      return this._state.color;
    } else if (this._node.nestModel.isWeightRecorder) {
      const models = this._node.assignedModels;
      if (models.length === 1) {
        const connection = models[0].connections[0];
        return connection.source.view.color;
      }
    } else if (this._node.model.isRecorder) {
      const connections: NESTConnection[] = this._node.network.connections.all.filter(
        (connection: NESTConnection) =>
          connection.sourceIdx === this._node.idx ||
          connection.targetIdx === this._node.idx
      );
      if (
        connections.length === 1 &&
        connections[0].sourceIdx !== connections[0].targetIdx
      ) {
        const connection: NESTConnection = connections[0];
        const node: NESTNode =
          (connection.sourceIdx === this._node.idx
            ? connection.target
            : connection.source) as NESTNode;
        return node.view.color;
      }
    }
    return this._node.network.getNodeColor(this._node.idx);
  }

  set color(value: string) {
    this._state.color = value === "none" || value === "" ? undefined : value;
    this._node.network.clean();
  }

  get label(): string {
    if (this._state.label) {
      return this._state.label;
    }

    let nodes: NESTNode[];
    let idx: number;
    let label: string;
    // let varname: string;

    switch (this._node.model.elementType) {
      case "neuron":
        nodes = this._node.nodes.neurons as NESTNode[];
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
        nodes = this._node.nodes.all;
        idx = nodes.indexOf(this._node);
        label = "n" + (idx + 1);
        break;
      default:
        nodes = this._node.nodes.filterByModelId(this._node.modelId) as NESTNode[];
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

  get opacity(): boolean {
    return true || (
      this._node.nodes.state.selectedNode == null ||
      (this._node.nodes.state.selectedNode != null &&
        this._node.state.isSelected) ||
      (this._node.nodes.state.focusedNode != null && this._node.state.isFocused)
    );
  }

  get state(): UnwrapRef<NESTNodeViewState> {
    return this._state;
  }

  /**
   * Get term based on synapse weight.
   */
  get synWeights(): string {
    if (
      this._node.model.isRecorder ||
      this._node.network.connections.length === 0 ||
      this._node.connections.length === 0 ||
      this._node.connectionsNeurons.length === 0
    )
      return "";

    const weights: number[] = this._node.connectionsNeurons.map(
      (connection: NESTConnection) =>
        connection.synapse.params.weight.value as number
    );

    if (weights.every((weight: number) => weight > 0)) {
      return "excitatory";
    }
    if (weights.every((weight: number) => weight < 0)) {
      return "inhibitory";
    }
    return "mixed";
  }

  /**
   * Set all synaptic weights.
   *
   * @remarks
   * It emits node changes.
   *
   * @param term - inhibitory (negative) or excitatory (positive)
   */
  set synWeights(value: string) {
    this._state.synWeights = value;

    if (this._node.connectionsNeurons.length === 0) return;

    this._node.connectionsNeurons.forEach((connection: NESTConnection) => {
      connection.synapse.weightLabel = value;
    });
    this._node.changes();
  }

  /**
   * Clean node.
   */
  clean(): void {
    const cleanWeightRecorder = false;

    if (this._node.nestModel.isWeightRecorder && cleanWeightRecorder) {
      const copiedSynapseModels =
        this._node.nodes.network.modelsCopied.synapseModels.filter(
          (model: NESTCopyModel) => model.isAssignedToWeightRecorder(this._node)
        );

      if (copiedSynapseModels.length === 1) {
        const copiedSynapseModel = copiedSynapseModels[0];
        const connection =
          this._node.nodes.network.connections.getBySynapseModelId(
            copiedSynapseModel.id
          );
        if (connection) {
          this._state.position = connection.view.centerPosition;
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
  toJSON(): NESTNodeViewProps {
    const nodeView: NESTNodeViewProps = {
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
