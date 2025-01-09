// recorderActivity.ts

// import { NodeRecord } from "@/helpers/node/nodeRecord";
import { TNode } from "@/types";

import { Activity, IActivityProps } from "../activity/activity";

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

  get endTime(): number {
    return this.recorder.network.project.simulation.state.biologicalTime;
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

  get recorder(): TNode {
    return this._recorder;
  }

  /**
   * Clone activity.
   */
  override clone(): NodeActivity {
    return new NodeActivity(this.recorder, this.toJSON());
  }
}
