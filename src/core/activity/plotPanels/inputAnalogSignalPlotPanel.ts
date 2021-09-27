import { ActivityChartGraph } from '../activityChartGraph';
import { AnalogSignalPlotPanel } from './analogSignalPlotPanel';

export class InputAnalogSignalPlotPanel extends AnalogSignalPlotPanel {
  constructor(graph: ActivityChartGraph) {
    super(graph);
    this.icon = 'mdi-chart-bell-curve-cumulative';
    this.name = 'InputAnalogSignalPlotPanel';
    this.label = 'line of input analog signals';
    this.layout.yaxis.height = 1;
    this.init();
  }

  /**
   * Initialize plot panel for input signals.
   */
  init(): void {
    this.data = [];
    this.activities = this.graph.project.inputAnalogSignalActivities;
  }
}
