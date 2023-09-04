// nestNetworkState.ts

import { reactive, UnwrapRef } from "vue";
import { sha1 } from "object-hash";

import { NESTNetwork } from "./nestNetwork";
import { NESTNode } from "../node/nestNode";
import { NESTConnection } from "../connection/nestConnection";

interface NESTNetworkStateState {
  displayIdx: {
    connections: number[];
    models: number[];
    nodes: number[];
  };
  hash: string;
}

export class NESTNetworkState {
  private _state: UnwrapRef<NESTNetworkStateState>;

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

  private _network: NESTNetwork; // parent

  constructor(network: NESTNetwork) {
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

  get state(): UnwrapRef<NESTNetworkStateState> {
    return this._state;
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._state.hash = sha1({
      nodes: this._network.nodes.all.map((node: NESTNode) => node.state.hash),
      connections: this._network.connections.all.map(
        (connection: NESTConnection) => connection.state.hash
      ),
    }).slice(0, 6);
    this._network.logger.settings.name = `[${this._network.project.shortId}] network #${this._state.hash}`;
  }
}
