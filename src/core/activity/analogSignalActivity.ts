import axios from 'axios';

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

  repeat(data: any): number[] {
    return data.simulationTimes.flatMap((e: number) =>
      Array(data.nodeIds.length).fill(e)
    );
  }

  tile(data: any): number[] {
    return data.simulationTimes.flatMap(() => data.nodeIds);
  }

  /**
   * Get activity from Insite.
   */
  override getActivityInsite(): void {
    // console.log('Get analog signal activity from Insite');
    const attribute: string = 'V_m';

    const url = `http://localhost:8080/nest/multimeters/${this.nodeCollectionId}`;
    axios
      .get(url + `/attributes/${attribute}?fromTime=${this.lastTime}`)
      .then((response: any) => {
        const times: number[] = this.repeat(response.data);
        const senders: number[] = this.tile(response.data);
        const activity: any = {
          events: {
            times, // x
            senders,
          },
          nodeIds: response.data.nodeIds, // from insite
          times: response.data.simulationTimes, // from insite
        };
        activity.events[attribute] = response.data.values;
        this.update(activity);

        this.lastFrame = this.lastTime + 1 >= this.endtime;

        // Recursive call after 100ms.
        setTimeout(() => {
          if (!this.lastFrame) {
            this.getActivityInsite();
          }
        }, 100);
      });
  }
}
