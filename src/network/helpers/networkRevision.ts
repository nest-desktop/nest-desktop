// networkRevision.ts

import { sha1 } from "object-hash";
import type { TNetwork, TNode } from "@/types";
import { BaseObj } from "@/core";

import type { INetworkState } from "../network";
import type { INodeState } from "../node";
import { getCurrentViewStore } from "@/app";
import { nextTick } from "vue";

interface INetworkRevisionState extends INetworkState {
  hash?: string;
}

export class NetworkRevision extends BaseObj<INetworkRevisionState> {
  private _network: TNetwork;
  private _states: INetworkRevisionState[] = [];
  private _revisionIdx = -1;

  constructor(network: TNetwork) {
    super();

    this._network = network;
  }

  get network(): TNetwork {
    return this._network;
  }

  get revisionIdx(): number {
    return this._revisionIdx;
  }

  get states(): INetworkRevisionState[] {
    return this._states;
  }

  /**
   * Checkout network revision.
   */
  checkout(): void {
    this.logger.trace("checkout network");

    // const networkState = this.load();
    // this.network.load(networkState);
    this.network.clean();

    // Generate simulation code.
    // this.generateCode();

    const projectViewStore = getCurrentViewStore("project");
    if (projectViewStore?.state.simulationEvents.onCheckout) {
      // Run simulation.
      nextTick(() => this.network.project.startSimulation());
    } else {
      // Update activities in activity graph.
      this.network.project.activityGraph.activityChartGraph.updateActivities();

      // Update activity graph.
      this.network.project.activityGraph.update();
    }
  }

  /**
   * Clear network history list.
   */
  clear(): void {
    this._states = [];
    this._revisionIdx = -1;
  }

  /**
   * Add network to the history list.
   */
  commit(withActivity: boolean = false): void {
    this.logger.trace("commit network");

    const hash = sha1(this.network.save());
    if (hash == null || hash == undefined || hash.length == 0) return;

    // Remove networks after the current.
    this._states = this.states.slice(0, this.revisionIdx + 1);

    // Limit max amount of network states.
    const maxRevisions: number = 9;
    if (this.states.length > maxRevisions) this._states = this.states.slice(this.states.length - maxRevisions);

    // Get last network of the states.
    const lastNetwork: INetworkRevisionState = this.states.length > 0 ? this._states[this.states.length - 1] : {};

    const currentNetwork: INetworkRevisionState =
      this.states.length > 0 && lastNetwork.hash === hash
        ? (this.states.pop() as INetworkRevisionState)
        : this.network.save();

    // Copy code hash to current network.
    currentNetwork.hash = hash;

    if (withActivity && (currentNetwork.nodes != null || currentNetwork.nodes != undefined)) {
      // Add activity to recorder nodes only if hashes is matched.
      this.network.nodes.recorders.forEach((node: TNode) => {
        const nodes = currentNetwork.nodes as INodeState[];
        if (nodes) nodes[node.idx].activity = node.activity?.save();
      });
    }

    // Push current network to the states.
    this.states.push(currentNetwork);

    // Update idx of the latest network revision.
    this._revisionIdx = this._states.length - 1;
  }

  /**
   * Initialize network revision.
   */
  init(): void {
    this.clear();
    this.commit();
  }

  /**
   * Load network from the history list.
   * @remarks It generates code.
   */
  load(): INetworkRevisionState | undefined {
    this.logger.trace("checkout network");

    // Update revision idx.
    if (this._revisionIdx >= this._states.length) this._revisionIdx = this._states.length - 1;

    // Update network.
    return this._states[this._revisionIdx];
  }

  /**
   * Go to the newer network.
   */
  newer(): void {
    if (this._revisionIdx < this._states.length) this._revisionIdx++;
    this.checkout();
  }

  /**
   * Go to the newest network.
   */
  newest(): void {
    this._revisionIdx = this._states.length - 1;
    this.checkout();
  }

  /**
   * Go to the older network.
   */
  older(): void {
    if (this._revisionIdx > 0) this._revisionIdx--;
    this.checkout();
  }

  /**
   * Go to the oldest network.
   */
  oldest(): void {
    this._revisionIdx = 0;
    this.checkout();
  }
}
