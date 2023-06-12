// connectionState.ts

import { Connection } from "./connection";

export class ConnectionState {
  private _connection: Connection; // parent

  constructor(connection: Connection) {
    this._connection = connection;
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
}
