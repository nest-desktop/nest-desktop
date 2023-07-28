// networkState.ts

import { reactive, UnwrapRef } from "vue";
import { sha1 } from "object-hash";

import { Network } from "./network";
import { Node } from "../node/node";
import { Connection } from "../connection/connection";

interface NetworkStateState {
  displayIdx: {
    connections: number[];
    models: number[];
    nodes: number[];
  };
  hash: string;
}

export class NetworkState {
  private _state: UnwrapRef<NetworkStateState>;

  private _icons = {
    all: {
      off: "mdi-checkbox-blank-outline",
      on: "mdi-checkbox-marked-outline",
      tab: "mdi-all-inclusive",
    },
    model: { tab: "$copyModel" },
    neuron: {
      off: "mdi-alpha-n-box-outline",
      on: "mdi-alpha-n-box",
      tab: "mdi-shape-outline",
    },
    recorder: {
      off: "mdi-alpha-r-box-outline",
      on: "mdi-alpha-r-box",
      tab: "$recorder",
    },
    stimulator: {
      off: "mdi-alpha-s-box-outline",
      on: "mdi-alpha-s-box",
      tab: "$stimulator",
    },
    synapse: { off: "mdi-alpha-s-circle-outline", on: "mdi-alpha-s-circle" },
  };

  private _network: Network; // parent

  constructor(network: Network) {
    this._network = network;
    this._state = reactive({
      displayIdx: {
        connections: [],
        models: [],
        nodes: [],
      },
      hash: "",
    });
  }

  get hash(): string {
    return this._state.hash;
  }

  get icons(): { [key: string]: { [key: string]: string } } {
    return this._icons;
  }

  get state(): UnwrapRef<NetworkStateState> {
    return this._state;
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._state.hash = sha1({
      nodes: this._network.nodes.all.map((node: Node) => node.state.hash),
      connections: this._network.connections.all.map(
        (connection: Connection) => connection.state.hash
      ),
    }).slice(0, 6);
    this._network.logger.settings.name = `[${this._network.project.shortId}] network #${this._state.hash}`;
  }
}
