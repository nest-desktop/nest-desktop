import { ActivityChartGraph } from '../activityChartGraph';
import { AnalogSignalPlotPanel } from './analogSignalPlotPanel';

export class InputAnalogSignalPlotPanel extends AnalogSignalPlotPanel {
  constructor(graph: ActivityChartGraph) {
    super(graph);
    this.icon = 'mdi-chart-line';
    this.name = 'InputAnalogSignalPlotPanel';
    this.label = 'line of input analog signals';
    this.init();
  }

  /**
   * Initialize plot panel for input signals.
   */
  init(): void {
    this.activities = this.graph.project.inputAnalogSignalActivities;
    this.data = [];
  }
}
