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
    this.state.records = [...this.recorder.records];
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
    if (!this.project.insite.state.on) {
      return;
    }

    const attribute: string = 'V_m';
    const path = `nest/multimeters/${this.nodeCollectionId}/attributes/${attribute}/?fromTime=${this.lastTime}`;
    this.project.app.backends.insiteAccess.instance
      .get(path)
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

        // Recursive call after 100ms.
        setTimeout(() => {
          this.getActivityInsite();
        }, 100);
      });
  }
}
