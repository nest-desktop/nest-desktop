// recorderAnalogSignalActivity.ts

import { TNode } from "@/types";

import { IActivityProps } from "../activity/activity";
import { NodeActivity } from "./nodeActivity";
import { NodeRecord } from "../node/nodeRecord";

export class NodeAnalogSignalActivity extends NodeActivity {
  constructor(recorder: TNode, activityProps: IActivityProps = {}) {
    super(recorder, activityProps);
  }

  /**
   * Clone analog signal activity.
   * It creates a new component with JSON data.
   */
  override clone(): NodeAnalogSignalActivity {
    this.logger.trace("clone");

    const activity = new NodeAnalogSignalActivity(this.recorder, this.toJSON());
    activity.init();
    return activity;
  }

  /**
   * Get node record.
   * @param groupId string
   * @returns node record object
   */
  getNodeRecord(groupId: string): NodeRecord | undefined {
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
