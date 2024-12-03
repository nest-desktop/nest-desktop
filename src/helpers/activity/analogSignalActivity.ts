// analogSignalActivity.ts

import { TNode } from "@/types";

import { NodeRecord } from "../node/nodeRecord";
import { Activity, IActivityProps } from "./activity";

export class AnalogSignalActivity extends Activity {
  constructor(recorder: TNode, activityProps: IActivityProps = {}) {
    super(recorder, activityProps);
  }

  /**
   * Clone analog signal activity.
   * It creates a new component with JSON data.
   */
  override clone(): AnalogSignalActivity {
    return new AnalogSignalActivity(this.recorder, this.toJSON());
  }

  /**
   * Get node record.
   * @param groupId string
   * @returns node record object
   */
  getNodeRecord(groupId: string): NodeRecord | undefined {
    if (this.recorder.records.length === 0) return;

    return this.recorder.records.find(
      (record: NodeRecord) => record.groupId === groupId
    );
  }

  /**
   * Post-initialize activity of analog signals.
   */
  // override postInit(): void {
  //   this.updateActivityRecords();
  // }

  /**
   * Post-update activity of analog signals.
   */
  // override postUpdate(): void {
  //   this.updateActivityRecords();
  // }

  /**
   * Update records from recorder.
   */
  // updateActivityRecords(): void {
  //   if (this.recorder.records.length === 0) return;

  //   this.state.records = [...this.recorder.records];
  // }
}
