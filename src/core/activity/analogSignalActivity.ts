import { Activity } from './activity';
import { Node } from '../node/node';

export class AnalogSignalActivity extends Activity {
  constructor(recorder: Node, activity: any = {}) {
    super(recorder, activity);
  }

  /**
   * Post-initialize activity of analog signals.
   */
  override postInit(): void {
    this.updateActivityRecords();
  }

  /**
   * Post-update activity of analog signals.
   */
  override postUpdate(): void {
    this.updateActivityRecords();
  }

  /**
   * Update records from recorder.
   */
  updateActivityRecords(): void {
    if (this.recorder.records.length === 0) return;

    this.state.records = [...this.recorder.records];
  }

  /**
   * Clone analog signal activity.
   * It creates a new component with JSON data.
   */
  override clone(): AnalogSignalActivity {
    return new AnalogSignalActivity(this.recorder, this.toJSON());
  }
}
