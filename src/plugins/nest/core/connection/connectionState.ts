// connectionState.ts

import { sha1 } from "object-hash";
import { UnwrapRef, reactive } from "vue";

import { Connection } from "./connection";

interface ConnectionStateState {
  hash: string;
  showRule: boolean,
}

export class ConnectionState {
  private _connection: Connection; // parent
  private _state: UnwrapRef<ConnectionStateState>;

  constructor(connection: Connection) {
    this._connection = connection;

    this._state = reactive({
      hash: "",
      showRule: false,
    });
  }

  get hash(): string {
    return this._state.hash;
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
      this._connection.connections.state.selectedConnection === this._connection
    );
  }

  /**
   * Returns the first six digits of the SHA-1 connection hash.
   * @returns 6-digit hash value
   */
  get shortHash(): string {
    return this._state.hash ? this._state.hash.slice(0, 6) : "";
  }

  get state(): UnwrapRef<ConnectionStateState> {
    return this._state;
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
