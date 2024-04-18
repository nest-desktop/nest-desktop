// synapse.ts

import { BaseObj } from "../common/base";
import { TConnection } from "@/types/connectionTypes";

export interface ISynapseProps {
  weight?: number;
}

export class BaseSynapse extends BaseObj {
  private readonly _name = "Synapse";
  private _weight: number;

  public _connection: TConnection; // parent

  constructor(connection: TConnection, synapseProps?: ISynapseProps) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._connection = connection;

    this._weight = synapseProps?.weight || 1;
  }

  get connection(): TConnection {
    return this._connection;
  }

  get icon(): string {
    if (this.connection.view.connectRecorder() || this.weight === 0) {
      return "network:synapse-recorder";
    } else {
      return (
        "network:synapse-" + (this.weight > 0 ? "excitatory" : "inhibitory")
      );
    }
  }

  /**
   * Check if synapse parameter can be spatial.
   */
  get isSpatial(): boolean {
    return false;
  }

  get name(): string {
    return this._name;
  }

  get weight(): number {
    return this._weight;
  }

  set weight(value: number) {
    this._weight = value;
  }

  get weightColor(): string {
    if (this.connection.view.connectRecorder() || this.weight === 0) {
      return "grey";
    } else {
      return this.weight > 0 ? "blue" : "red";
    }
  }

  get weightLabel(): string {
    return this.weight === 0
      ? ""
      : this.weight > 0
      ? "excitatory"
      : "inhibitory";
  }

  set weightLabel(value: string) {
    this.weight =
      (value === "inhibitory" ? -1 : 1) * Math.abs(this.weight as number);
  }

  /**
   * Observer for synapse changes.
   *
   * @remarks
   * It emits connection changes.
   */
  changes(): void {
    this.logger.trace("changes");
    this.updateHash();
    this.connection.changes();
  }

  /**
   * Initialize synapse.
   */
  init(): void {
    this.logger.trace("init");
    this.updateHash();
  }

  /**
   * Inverse synaptic weight.
   */
  inverseWeight(): void {
    this.logger.trace("inverse weight");
    this.weight = -1 * this.weight;
    this.connection.changes();
  }

  /**
   * Reset synaptic weight.
   */
  reset(): void {
    this.weight = 1;
  }

  /**
   * Serialize for JSON.
   * @return synapse props
   */
  toJSON(): ISynapseProps {
    const synapseProps: ISynapseProps = {};

    if (this.weight !== 1) {
      synapseProps.weight = this.weight;
    }

    return synapseProps;
  }

  updateHash(): void {
    this._updateHash(this.toJSON());
  }
}
