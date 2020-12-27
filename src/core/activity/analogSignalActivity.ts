// import { Config } from '../config';
import { Activity } from './activity';
import { Node } from '../node/node';


export class AnalogSignalActivity extends Activity {

  constructor(recorder: Node, activity: any = {}) {
    super(recorder, activity);
  }

  clone(): AnalogSignalActivity {
    return new AnalogSignalActivity(this.recorder, this.toJSON());
  }

}
