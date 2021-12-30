import { ActivityChartPanel } from '../activityChartPanel';
import { AnalogSignalPlotModel } from './analogSignalPlotModel';

export class NeuronAnalogSignalPlotModel extends AnalogSignalPlotModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.icon = 'mdi-chart-bell-curve-cumulative';
    this.id = 'neuronAnalogSignalPlot';
    this.label = 'neuron analog signals';
    this.panel.layout.yaxis.height = 2;
    this.initActivities();
  }

  /**
   * Initialize plot panel for neuronal analog signals.
   */
  override initActivities(): void {
    this.activities = this.panel.graph.project.neuronAnalogSignalActivities;
  }
}
