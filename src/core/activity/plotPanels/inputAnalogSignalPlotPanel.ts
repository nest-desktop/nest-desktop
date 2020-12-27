import { Activity } from '../activity';
import { ActivityChartGraph } from '../activityChartGraph';
import { AnalogSignalPlotPanel } from './analogSignalPlotPanel';


export class InputAnalogSignalPlotPanel extends AnalogSignalPlotPanel {

  constructor(graph: ActivityChartGraph) {
    super(graph);
    this.name = 'InputAnalogSignalPlotPanel';
    this.label = 'plot of input analog signals';
    this.init();
  }

  init(): void {
    this.activities = this.graph.project.activities.filter((activity: Activity) => activity.hasInputAnalogData());
    this.data = [];
  }

}
