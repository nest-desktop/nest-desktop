import { Activity } from '../activity';
import { ActivityGraph } from './activityGraph';
import { AnalogLines } from './analogLines';


export class InputAnalogLines extends AnalogLines {

  constructor(graph: ActivityGraph) {
    super(graph);
    this.init();
  }

  get activities(): Activity[] {
    return this.graph.project.activities.filter(activity =>
      ['voltmeter', 'multimeter'].includes(activity.recorder.model.existing) && activity.elementTypes.includes('stimulator'));
  }

}
