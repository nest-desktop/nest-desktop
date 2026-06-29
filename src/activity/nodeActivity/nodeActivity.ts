// nodeActivity.ts

import type { NodeRecord } from "@/network";
import type { TNetworkProject, TNode } from "@/types";
import { sum } from "@/utils";

import { Activity } from "../helpers/activity";

export class NodeActivity extends Activity {
  private _recorder: TNode; // parent

  constructor(recorder: TNode) {
    super(recorder.network.project);

    this._recorder = recorder;
  }

  override get traceColor(): string {
    return this.recorder.view.color;
  }

  get elementTypes(): string[] {
    return this.recorder.nodes.all.map((node: TNode) => node.model.elementType);
  }

  get currentTime(): number {
    const simulationState = this.project.simulation.state;
    return simulationState.timeInfo && simulationState.timeInfo.current > 0
      ? simulationState.timeInfo?.current
      : (simulationState.biologicalTime as number);
  }

  get endTime(): number {
    return this.project.simulation.state.biologicalTime as number;
  }

  /**
   * Check if activity contains analog signal data from input devices.
   */
  get hasInputAnalogData(): boolean {
    return this.recorder.model?.isAnalogRecorder && this.elementTypes.includes("stimulator");
  }

  /**
   * Check if activity contains analog signal data from neurons.
   */
  get hasNeuronAnalogData(): boolean {
    return this.recorder.model?.isAnalogRecorder && this.elementTypes.includes("neuron");
  }

  override get nodeSize(): number {
    return sum(this.recorder.nodes.all.map((node: TNode) => node.size?.value ?? 1) as number[]);
  }

  override get project(): TNetworkProject {
    return this.recorder.network.project as TNetworkProject;
  }

  get recorder(): TNode {
    return this._recorder;
  }

  get simulationTimeInfo(): number {
    return this.project.simulation.state.timeInfo as number;
  }

  /**
   * Get node record.
   */
  getNodeRecord(): NodeRecord | undefined {
    return;
  }
}
