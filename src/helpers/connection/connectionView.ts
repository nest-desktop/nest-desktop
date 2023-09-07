// connectionView.ts

import { UnwrapRef, reactive } from "vue";

import { Connection } from "@/types/connectionTypes";
import { calcPathNode } from "../connectionGraph/connectionGraphPath";
import { randomUniformInt } from "../random";
import { BaseConnection } from "./baseConnection";

interface ConnectionViewState {
  xAxisRotation: number;
  visible?: boolean;
}

export class ConnectionView {
  private _colorExcitation = "#595289"; // '#467ab3';
  private _colorInhibition = "#AF143C"; // '#b34846';
  private _connection: Connection; // parent
  private _state: UnwrapRef<ConnectionViewState>;

  constructor(connection: Connection) {
    this._connection = connection;

    this._state = reactive({
      xAxisRotation: randomUniformInt(0, 90),
    });
  }

  get centerPosition(): { x: number; y: number } {
    const p0 = this._connection.source.view.state.position;
    const p1 = this._connection.target.view.state.position;
    return { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
  }

  /**
   * Get connection color based on synapse weight.
   */
  get colorWeight(): string {
    const value: number = this._connection.synapse.weight;
    if (value === 0) {
      return "black";
    }
    return value > 0 ? this._colorExcitation : this._colorInhibition;
  }

  get connectionGraphOptions(): {
    ellipticalArc: number;
    sweep: number;
    xAxisRotation: number;
  } {
    return {
      ellipticalArc:
        this._connection.source.state.isSelected &&
        this._connection.source.connections.length > 1
          ? 1
          : 10,
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
    const source = this._connection.source.view.state.position;
    const target = this._connection.target.view.state.position;
    const path = calcPathNode(source, target, this.connectionGraphOptions);
    return { x: path.x2, y: path.y2 };
  }

  get opacity(): boolean {
    const focusedConnection = this._connection.connections.state
      .focusedConnection as BaseConnection;

    return (
      this._connection.source.connections.length === 1 ||
      focusedConnection?.source !== this._connection.source ||
      this._connection._connections.state.focusedConnection == null ||
      this._connection.state.isFocused ||
      this._connection.state.isSelected
    );
  }

  get pathCentroidPosition(): { x: number; y: number } {
    const source = this._connection.source.view.state.position;
    const target = this._connection.view.markerEndPosition;
    const path = calcPathNode(source, target, this.connectionGraphOptions);
    const x2 = path.x1 + Math.cos(0) * path.tr;
    const y2 = path.y1 + Math.sin(0) * path.tr;
    return { x: x2, y: y2 };
  }

  get state(): UnwrapRef<ConnectionViewState> {
    return this._state;
  }

  get toRight(): boolean {
    return (
      this._connection.source.view.state.position.x <
      this._connection.target.view.state.position.x
    );
  }

  /**
   * Check if it is connected by neurons only.
   */
  connectOnlyNeurons(): boolean {
    return (
      this._connection.source.model.isNeuron &&
      this._connection.target.model.isNeuron
    );
  }

  /**
   * Check if it is connected to any recorder.
   */
  connectRecorder(): boolean {
    return (
      this._connection.source.model.isRecorder ||
      this._connection.target.model.isRecorder
    );
  }

  /**
   * Check if it is connected to spike recorder.
   */
  connectSpikeRecorder(): boolean {
    return this._connection.target.model.isSpikeRecorder;
  }

  /**
   * Calculate the distance of connected nodes.
   */
  distance(): number {
    if (this._connection.source === this._connection.target) {
      return 0;
    }

    const source: any = this._connection.source.view.state.position;
    const target: any = this._connection.target.view.state.position;
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
