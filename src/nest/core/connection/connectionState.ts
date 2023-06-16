// connectionState.ts

import { sha1 } from "object-hash";

import { Connection } from "./connection";
import { UnwrapRef, reactive } from "vue";

interface ConnectionStateState {
  hash: string;
}

export class ConnectionState {
  private _connection: Connection; // parent
  private _state: UnwrapRef<ConnectionStateState>;

  constructor(connection: Connection) {
    this._connection = connection;

    this._state = reactive({
      hash: "",
    });
  }

  get hash(): string {
    return this._state.hash;
  }

  /**
   * Check if any connection is selected.
   */
  get isAnySelected(): boolean {
    return this._connection.network.state.selectedConnection != null;
  }

  /**
   * Check if this connection is focused.
   */
  get isFocused(): boolean {
    return this._connection.network.state.isConnectionFocused(
      this._connection,
      false
    );
  }

  /**
   * Check if this connection is selected.
   */
  get isSelected(): boolean {
    return this._connection.network.state.isConnectionSelected(
      this._connection,
      true
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
  focus(forced: boolean = false): void {
    const networkState = this._connection.network.state;
    if (forced) {
      networkState.resetFocus();
    }
    networkState.focusedConnection = this._connection;
  }

  /**
   * Select this connection.
   */
  select(forced: boolean = false): void {
    const networkState = this._connection.network.state;
    if (forced) {
      networkState.resetSelection();
    }
    networkState.selectedConnection = this._connection;
  }

  update() {
    this.updateHash();
  }

  /**
   * Update hash for connection graph.
   */
  updateHash(): void {
    this._state.hash = sha1({
      // color: this.source.view.color,
      idx: this._connection.idx,
    });
  }
}
