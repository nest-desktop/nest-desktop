// analogSignalActivity.ts

import { TProject } from "@/types";

import { Activity, IActivityProps } from "./activity";

export class AnalogSignalActivity extends Activity {
  constructor(project: TProject, activityProps: IActivityProps = {}) {
    super(project, activityProps);
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
