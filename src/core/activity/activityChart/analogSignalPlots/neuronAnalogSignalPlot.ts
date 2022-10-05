import { ActivityChartPanel } from '../activityChartPanel';
import { AnalogSignalPlot } from './analogSignalPlot';

export class NeuronAnalogSignalPlot extends AnalogSignalPlot {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.panel.height = 20;
    this.panel.xaxis = 1;

    this.initActivities();
    this.init(model.records);
  }

  /**
   * Initialize plot panel for neuronal analog signals.
   */
  override initActivities(): void {
    this.activities = this.panel.graph.project.neuronAnalogSignalActivities;
  }
}
