// networkState.ts

import { reactive, UnwrapRef } from "vue";

import { TNetwork } from "@/types/networkTypes";

interface INetworkState {
  displayIdx: {
    connections: number[];
    models: number[];
    nodes: number[];
  };
}

export class NetworkState {
  private _icons = {
    all: {
      off: "mdi:mdi-checkbox-blank-outline",
      on: "mdi:mdi-checkbox-marked-outline",
      tab: "mdi:mdi-all-inclusive",
    },
    model: { tab: "$copyModel" },
    neuron: {
      off: "mdi:mdi-alpha-n-box-outline",
      on: "mdi:mdi-alpha-n-box",
      tab: "mdi:mdi-shape-outline",
    },
    recorder: {
      off: "mdi:mdi-alpha-r-box-outline",
      on: "mdi:mdi-alpha-r-box",
      tab: "$recorder",
    },
    stimulator: {
      off: "mdi:mdi-alpha-s-box-outline",
      on: "mdi:mdi-alpha-s-box",
      tab: "$stimulator",
    },
    synapse: {
      off: "mdi:mdi-alpha-s-circle-outline",
      on: "mdi:mdi-alpha-s-circle",
    },
  };
  private _network: TNetwork; // parent
  private _state: UnwrapRef<INetworkState>;

  constructor(network: TNetwork) {
    this._network = network;
    this._state = reactive({
      displayIdx: {
        connections: [],
        models: [],
        nodes: [],
      },
    });
  }

  get icons(): { [key: string]: { [key: string]: string } } {
    return this._icons;
  }

  get network(): TNetwork {
    return this._network;
  }

  get networkAllTypes(): TNetwork {
    return this._network;
  }

  get state(): UnwrapRef<INetworkState> {
    return this._state;
  }

  /**
   * Unselect all nodes and connections.
   */
  unselectAll(): void {
    this._network.connections.unselectAll();
    this._network.nodes.unselectNodes();
  }
}
