// connectionView.ts

import { UnwrapRef, reactive } from "vue";

import { TConnection } from "@/types";

import { randomUniformInt } from "../../utils/random";
import { calcPathNode } from "../connectionGraph/connectionGraphPath";

interface IConnectionViewState {
  xAxisRotation: number;
  visible?: boolean;
}

export class ConnectionView {
  private _colorExcitation = "#595289"; // '#467ab3';
  private _colorInhibition = "#AF143C"; // '#b34846';
  private _connection: TConnection; // parent
  private _state: UnwrapRef<IConnectionViewState>;

  constructor(connection: TConnection) {
    this._connection = connection;

    this._state = reactive<IConnectionViewState>({
      xAxisRotation: randomUniformInt(0, 90),
    });
  }

  get centerPosition(): { x: number; y: number } {
    const p0 = this._connection.source.view.position;
    const p1 = this._connection.target.view.position;
    return { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
  }

  /**
   * Get connection color based on synapse weight.
   */
  get colorWeight(): string {
    const value: number = this._connection.synapse.weight;
    if (value === 0) return "black";
    return value > 0 ? this._colorExcitation : this._colorInhibition;
  }

  get connectionGraphOptions(): {
    ellipticalArc: number;
    sweep: number;
    xAxisRotation: number;
  } {
    return {
      ellipticalArc: this._connection.source.isSelected && this._connection.source.connections.length > 1 ? 1 : 5,
      sweep: this._connection.idx % 2,
      xAxisRotation: this._state.xAxisRotation,
    };
  }

  /**
   * Generates a string describing the end of this connections' marker.
   */
  get markerEndLabel(): string {
    if (this.connectRecorder()) {
      return "generic";
    } else if (this._connection.synapse.weight > 0) {
      return "exc";
    } else if (this._connection.synapse.weight < 0) {
      return "inh";
    }
    return "generic";
  }

  get markerEndPosition(): { x: number; y: number } {
    const source = this._connection.source.view.position;
    const target = this._connection.target.view.position;
    const path = calcPathNode(source, target, this.connectionGraphOptions);
    return { x: path.x2, y: path.y2 };
  }

  get opacity(): boolean {
    const focusedConnection = this._connection.connections.state.focusedConnection as TConnection;

    return (
      this._connection.sourceNode.connections.length === 1 ||
      focusedConnection?.sourceNode !== this._connection.sourceNode ||
      this._connection._connections.state.focusedConnection == null ||
      this._connection.state.isFocused ||
      this._connection.state.isSelected
    );
  }

  get pathCentroidPosition(): { x: number; y: number } {
    const source = this._connection.source.view.position;
    const target = this._connection.view.markerEndPosition;
    const path = calcPathNode(source, target, this.connectionGraphOptions);
    const x2 = path.x1 + Math.cos(0) * path.tr;
    const y2 = path.y1 + Math.sin(0) * path.tr;
    return { x: x2, y: y2 };
  }

  get state(): UnwrapRef<IConnectionViewState> {
    return this._state;
  }

  get toRight(): boolean {
    return this._connection.source.view.position.x < this._connection.target.view.position.x;
  }

  /**
   * Check if it is connected by neurons only.
   */
  connectOnlyNeurons(): boolean {
    const sourceNode = this._connection.sourceNode;
    const targetNode = this._connection.targetNode;
    return (
      (sourceNode.isNode ? sourceNode.model.isNeuron : false) && (targetNode.isNode ? targetNode.model.isNeuron : false)
    );
  }

  /**
   * Check if it is connected to any recorder.
   */
  connectRecorder(): boolean {
    const sourceNode = this._connection.sourceNode;
    const targetNode = this._connection.targetNode;
    return (
      (sourceNode.isNode ? sourceNode.model.isRecorder : false) ||
      (targetNode.isNode ? targetNode.model.isRecorder : false)
    );
  }

  /**
   * Check if it is connected to spike recorder.
   */
  connectSpikeRecorder(): boolean {
    return this._connection.targetNode.isNode ? this._connection.targetNode.model.isSpikeRecorder : false;
  }

  /**
   * Calculate the distance of connected nodes.
   */
  distance(): number {
    if (this._connection.sourceNode === this._connection.targetNode) {
      return 0;
    }

    const source: { x: number; y: number } = this._connection.source.view.position;
    const target: { x: number; y: number } = this._connection.target.view.position;
    const x1: number = source.x;
    const y1: number = source.y;
    const x2: number = target.x;
    const y2: number = target.y;
    const dx: number = x2 - x1;
    const dy: number = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Check if the connection is probabilistic.
   */
  probabilistic(): boolean {
    return !["all_to_all", "one_to_one"].includes(this._connection.rule.value);
  }
}
