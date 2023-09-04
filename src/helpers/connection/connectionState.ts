// connectionState.ts

import { sha1 } from "object-hash";
import { UnwrapRef, reactive } from "vue";

import { Connection } from "@/types/connectionTypes";
import { BaseConnection } from "./baseConnection";

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

  get connection(): BaseConnection {
    return this._connection as BaseConnection;
  }

  get hash(): string {
    return this._state.hash;
  }

  /**
   * Check if this connection is focused.
   */
  get isFocused(): boolean {
    return (
      this.connection.connections.state.focusedConnection === this._connection
    );
  }

  /**
   * Check if this connection is selected.
   */
  get isSelected(): boolean {
    return (
      this.connection.connections.state.selectedConnection === this._connection
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
    this.connection.connections.state.focusedConnection = this._connection;
  }

  /**
   * Select this connection.
   */
  select(): void {
    const connections = this.connection.connections;
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
      idx: this.connection.idx,
      sourceModelId: this.connection.source.modelId,
      targetModelId: this.connection.target.modelId,
    }).slice(0, 6);
    this.connection.logger.settings.name = `[${this.connection.connections.network.project.shortId}] connection #${this._state.hash}`;
  }
}
