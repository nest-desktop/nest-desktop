import { ActivityChartGraph } from '../activityChartGraph';
import { AnalogSignalPlotPanel } from './analogSignalPlotPanel';

export class NeuronAnalogSignalPlotPanel extends AnalogSignalPlotPanel {
  constructor(graph: ActivityChartGraph) {
    super(graph);
    this.icon = 'mdi-chart-bell-curve-cumulative';
    this.name = 'NeuronAnalogSignalPlotPanel';
    this.label = 'line of neuron analog signals';
    this.layout.yaxis.height = 2;
    this.init();
  }

  /**
   * Initialize plot panel for neuronal analog signals.
   */
  init(): void {
    this.data = [];
    this.activities = this.graph.project.neuronAnalogSignalActivities;
  }
}
