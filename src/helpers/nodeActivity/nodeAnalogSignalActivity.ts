// nodeAnalogSignalActivity.ts

import type { TNode } from "@/types";

// TODO: No imports from network graph!
import { NodeRecord } from "@/networkGraph/helpers/node/nodeRecord";

import type { IActivityProps } from "../activity";
import { NodeActivity } from "./nodeActivity";

export class NodeAnalogSignalActivity extends NodeActivity {
  constructor(recorder: TNode, activityProps: IActivityProps = {}) {
    super(recorder, activityProps);
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
