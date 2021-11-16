import { ActivityChartPanel } from '../activityChartPanel';
import { AnalogSignalPlotModel } from './analogSignalPlotModel';

export class NeuronAnalogSignalPlotModel extends AnalogSignalPlotModel {
  constructor(panel: ActivityChartPanel) {
    super(panel);
    this.icon = 'mdi-chart-bell-curve-cumulative';
    this.id = 'NeuronAnalogSignalPlot';
    this.label = 'neuron analog signals';
    this.panel.layout.yaxis.height = 2;
    this.init();
  }

  /**
   * Initialize plot panel for neuronal analog signals.
   */
  override init(): void {
    this.initState();

    this.data = [];
    this.activities = this.panel.graph.project.neuronAnalogSignalActivities;
  }
}
