import { ActivityChartGraph } from '../activityChartGraph';
import { AnalogSignalPlotPanel } from './analogSignalPlotPanel';

export class NeuronAnalogSignalPlotPanel extends AnalogSignalPlotPanel {
  constructor(graph: ActivityChartGraph) {
    super(graph);
    this.icon = 'mdi-chart-line';
    this.name = 'NeuronAnalogSignalPlotPanel';
    this.label = 'line of neuron analog signals';
    this.layout.yaxis.height = 2;
    this.layout.yaxis.title = 'Membrane potential [mV]';
    this.init();
  }

  init(): void {
    this.activities = this.graph.project.neuronAnalogSignalActivities;
    this.data = [];
  }
}
