// synapse.ts

import { UnwrapRef, reactive } from "vue";
import { ILogObj, Logger } from "tslog";

import { Connection } from "@/types/connectionTypes";
import { logger as mainLogger } from "@/helpers/common/logger";

interface SynapseState {
  hash: string;
}

export interface SynapseProps {
  weight?: number;
}

export class BaseSynapse {
  private readonly _name = "Synapse";
  private _logger: Logger<ILogObj>;
  private _state: UnwrapRef<SynapseState>;
  private _weight: number;

  public _connection: Connection; // parent

  constructor(connection: Connection, synapse?: SynapseProps) {
    this._connection = connection;

    this._logger = mainLogger.getSubLogger({
      minLevel: 3,
      name: `synapse`,
    });

    this._state = reactive({
      hash: "",
    });

    this._weight = synapse?.weight || 1;
  }

  get connection(): Connection {
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

  get logger(): Logger<ILogObj> {
    return this._logger;
  }

  get name(): string {
    return this._name;
  }

  get state(): UnwrapRef<SynapseState> {
    return this._state;
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
    // this.updateHash()
    this.connection.changes();
  }

  /**
   * Inverse synaptic weight.
   */
  inverseWeight(): void {
    this._logger.trace("inverse weight");
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
   * @return synapse object
   */
  toJSON(): SynapseProps {
    const synapse: SynapseProps = {};

    if (this.weight !== 1) {
      synapse.weight = this.weight;
    }

    return synapse;
  }
}
