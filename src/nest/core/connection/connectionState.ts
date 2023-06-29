// connectionState.ts

import { sha1 } from "object-hash";

import { Connection } from "./connection";
import { UnwrapRef, reactive } from "vue";
import { randomUniformInt } from "@/utils/random";

interface ConnectionStateState {
  hash: string;
  xAxisRotation: number;
}

export class ConnectionState {
  private _connection: Connection; // parent
  private _state: UnwrapRef<ConnectionStateState>;
  private _sweep: number;

  constructor(connection: Connection) {
    this._connection = connection;

    this._state = reactive({
      hash: "",
      xAxisRotation: randomUniformInt(0, 360),
    });

    this._sweep = this._connection.connections.connectionsLength % 2;
  }

  get xAxisRotation(): number {
    return this._state.xAxisRotation;
  }
  set xAxisRotation(value: number) {
    this._state.xAxisRotation = value;
  }

  get hash(): string {
    return this._state.hash;
  }

  get connectionGraphOptions(): {
    ellipticalArc: number;
    sweep: number;
    xAxisRotation: number;
    isTargetMouse?: boolean;
  } {
    return {
      ellipticalArc:
        this._connection.source.state.isFocused ||
        this._connection.source.state.isSelected
          ? 1
          : 10,
      sweep: this._sweep,
      xAxisRotation: this._state.xAxisRotation,
    };
  }

  /**
   * Check if this connection is focused.
   */
  get isFocused(): boolean {
    return (
      this._connection.connections.state.focusedConnection === this._connection
    );
  }

  /**
   * Check if this connection is selected.
   */
  get isSelected(): boolean {
    return (
      this._connection.connections.state.selectedConnection ===
        this._connection || true
    );
  }

  /**
   * Returns the first six digits of the SHA-1 connection hash.
   * @returns 6-digit hash value
   */
  get shortHash(): string {
    return this._state.hash ? this._state.hash.slice(0, 6) : "";
  }

  /**
   * Focus this connection.
   */
  focus(): void {
    this._connection.connections.state.focusedConnection = this._connection;
  }

  /**
   * Select this connection.
   */
  select(): void {
    const connections = this._connection.connections;
    connections.state.selectedConnection = this.isSelected
      ? null
      : this._connection;
  }

  update() {
    this.updateHash();
  }

  /**
   * Update hash
   *
   * @emits rendering connection graph
   */
  updateHash(): void {
    this._state.hash = sha1({
      // color: this.source.view.color,
      idx: this._connection.idx,
      sourceModelId: this._connection.source.modelId,
      targetModelId: this._connection.target.modelId,
    }).slice(0, 6);
    this._connection.logger.settings.name = `[${this._connection.connections.network.project.shortId}] connection #${this._state.hash}`;
  }
}
