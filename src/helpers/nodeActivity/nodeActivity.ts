// recorderActivity.ts

// import { NodeRecord } from "@/helpers/node/nodeRecord";
import { TNetworkProject, TNode } from "@/types";

import { Activity, IActivityProps } from "../activity/activity";
import { sum } from "@/utils/array";

export class NodeActivity extends Activity {
  private _recorder: TNode; // parent

  constructor(recorder: TNode, activityProps: IActivityProps = {}) {
    super(recorder.network.project, activityProps);

    this._recorder = recorder;
    this.init(activityProps);
  }

  override get traceColor(): string {
    return this.recorder.view.color;
  }

  get elementTypes(): string[] {
    return this.recorder.nodes.nodeItems.map((node: TNode) => node.model.elementType);
  }

  get currentTime(): number {
    const simulationState = this.project.simulation.state;
    return simulationState.timeInfo.current > 0 ? simulationState.timeInfo.current : simulationState.biologicalTime;
  }

  get endTime(): number {
    return this.project.simulation.state.biologicalTime;
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
    return sum(this.recorder.nodes.nodeItems.map((node: TNode) => node.size));
  }

  override get project(): TNetworkProject {
    return this._recorder.network.project as TNetworkProject;
  }

  get recorder(): TNode {
    return this._recorder;
  }

  get simulationTimeInfo(): number {
    return this.project.simulation.state.timeInfo.value;
  }

  /**
   * Clone activity.
   */
  override clone(): NodeActivity {
    this.logger.trace("clone");

    const activity = new NodeActivity(this.recorder, this.toJSON());
    activity.init();
    return activity;
  }
}
