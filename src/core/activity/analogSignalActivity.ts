// import { Config } from '../config';
import { Activity } from './activity';
import { Node } from '../node/node';

export class AnalogSignalActivity extends Activity {
  constructor(recorder: Node, activity: any = {}) {
    super(recorder, activity);
  }

  /**
   * Clone analog signal activity.
   * It creates a new component with JSON data.
   */
  override clone(): AnalogSignalActivity {
    return new AnalogSignalActivity(this.recorder, this.toJSON());
  }
}
