// connectionState.ts

import { UnwrapRef, reactive } from "vue";

import { TConnection } from "@/types";

interface IConnectionState {
  showRule: boolean;
}

export class ConnectionState {
  private _connection: TConnection; // parent
  private _state: UnwrapRef<IConnectionState>;

  constructor(connection: TConnection) {
    this._connection = connection;

    this._state = reactive<IConnectionState>({
      showRule: false,
    });
  }

  get connection(): TConnection {
    return this._connection as TConnection;
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

  get state(): UnwrapRef<IConnectionState> {
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
}
