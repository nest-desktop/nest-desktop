// nodeAnalogSignalActivity.ts

// TODO: No imports from network graph!
import { NodeRecord } from "@/network";

import { NodeActivity } from "./nodeActivity";

export class NodeAnalogSignalActivity extends NodeActivity {
  /**
   * Get node record.
   * @param groupId string
   * @returns node record instance
   */
  override getNodeRecord(groupId: string): NodeRecord | undefined {
    console.log("get node record");
    if (this.recorder.records.length === 0) return;

    return this.recorder.records.find((record: NodeRecord) => record.groupId === groupId);
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
