// networkRevision.ts

// import { nextTick } from "vue";

import { TNode, TProject } from "@/types";

import { BaseObj } from "../common/base";
import { INetworkProps } from "./network";
import { INodeProps } from "../node/node";

interface INetworkRevisionProps extends INetworkProps {
  codeHash?: string;
}

export class NetworkRevision extends BaseObj {
  private _project: TProject;
  private _revisions: INetworkRevisionProps[] = [];
  private _revisionIdx = -1;

  constructor(project: TProject) {
    super();

    this._project = project;
    this.clear();
  }

  get revisionIdx(): number {
    return this._revisionIdx;
  }

  get revisions(): INetworkRevisionProps[] {
    return this._revisions;
  }

  /**
   * Load network from the history list.
   * @remarks It generates code.
   */
  load(): INetworkRevisionProps {
    this.logger.trace("checkout network");

    // Update revision idx.
    if (this._revisionIdx >= this._revisions.length) this._revisionIdx = this._revisions.length - 1;

    // Update network.
    return this._revisions[this._revisionIdx];
  }

  /**
   * Clear network history list.
   */
  clear(): void {
    this._revisions = [];
    this._revisionIdx = -1;
  }

  /**
   * Add network to the history list.
   */
  commit(withActivity: boolean = false): void {
    this.logger.trace("commit network");
    if (!("network" in this._project)) return;

    const codeHash = this._project.code.hash;
    // if (codeHash == null || codeHash == undefined || codeHash.length == 0) return;

    // Remove networks after the current.
    this._revisions = this._revisions.slice(0, this._revisionIdx + 1);

    // Limit max amount of network revisions.
    const maxRevisions: number = 9;
    if (this._revisions.length > maxRevisions)
      this._revisions = this._revisions.slice(this._revisions.length - maxRevisions);

    // Get last network of the revisions.
    const lastNetwork: INetworkRevisionProps =
      this._revisions.length > 0 ? this._revisions[this._revisions.length - 1] : {};

    const currentNetwork: INetworkRevisionProps =
      this._revisions.length > 0 && lastNetwork.codeHash === codeHash
        ? (this._revisions.pop() as INetworkRevisionProps)
        : this._project.network.toJSON();

    // Copy code hash to current network.
    currentNetwork.codeHash = codeHash;

    if (withActivity && (currentNetwork.nodes != null || currentNetwork.nodes != undefined)) {
      // Add activity to recorder nodes only if hashes is matched.
      this._project.network.nodes.recorders.forEach((node: TNode) => {
        const nodes = currentNetwork.nodes as INodeProps[];
        if (nodes) nodes[node.idx].activity = node.activity?.toJSON();
      });
    }

    // Push current network to the revisions.
    this._revisions.push(currentNetwork);

    // Update idx of the latest network revision.
    this._revisionIdx = this._revisions.length - 1;
  }

  /**
   * Initialize network revision.
   */
  init(): void {
    this.clear();
    this.commit();
  }

  /**
   * Go to the newer network.
   */
  newer(): void {
    if (!("network" in this._project)) return;
    if (this._revisionIdx < this._revisions.length) this._revisionIdx++;
    this._project.checkoutNetwork();
  }

  /**
   * Go to the newest network.
   */
  newest(): void {
    if (!("network" in this._project)) return;
    this._revisionIdx = this._revisions.length - 1;
    this._project.checkoutNetwork();
  }

  /**
   * Go to the older network.
   */
  older(): void {
    if (!("network" in this._project)) return;
    if (this._revisionIdx > 0) this._revisionIdx--;
    this._project.checkoutNetwork();
  }

  /**
   * Go to the oldest network.
   */
  oldest(): void {
    if (!("network" in this._project)) return;
    this._revisionIdx = 0;
    this._project.checkoutNetwork();
  }
}
