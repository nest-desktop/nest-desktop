// networkState.ts

import { reactive, UnwrapRef } from "vue";
import { sha1 } from "object-hash";

import { Connection } from "@/types/connectionTypes";
import { Network } from "@/types/networkTypes";
import { Node } from "@/types/nodeTypes";
import { truncate } from "@/utils/truncate";

interface BaseNetworkStateData {
  displayIdx: {
    connections: number[];
    nodes: number[];
  };
  hash: string;
}

export class BaseNetworkState {
  private _state: UnwrapRef<BaseNetworkStateData>;

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

  get network(): Network {
    return this._network;
  }

  get networkAllTypes(): Network {
    return this._network;
  }

  get state(): UnwrapRef<BaseNetworkStateData> {
    return this._state;
  }

  unSelectAll(): void {
    this._network.nodes.unselectNode();
    this._network.connections.unselectConnection();
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._state.hash = truncate(
      sha1({
        nodes: this.network.nodes.all.map((node: Node) => node.state.hash),
        connections: this.network.connections.all.map(
          (connection: Connection) => connection.state.hash
        ),
      })
    );
    this.network.logger.settings.name = `[${this.network.project.shortId}] network #${this._state.hash}`;
  }
}
