import { Connection } from './connection';

export class ConnectionState {
  private _connection: Connection; // parent

  constructor(connection: Connection) {
    this._connection = connection;
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
   * Check if this connection is focused.
   */
  isFocused(unselected: boolean = true): boolean {
    return this._connection.network.state.isConnectionFocused(
      this._connection,
      unselected
    );
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

  /**
   * Check if any connection is selected.
   */
  isAnySelected(): boolean {
    return this._connection.network.state.selectedConnection !== null;
  }

  /**
   * Check if this connection is selected.
   */
  isSelected(unselected: boolean = true): boolean {
    return this._connection.network.state.isConnectionSelected(
      this._connection,
      unselected
    );
  }
}
