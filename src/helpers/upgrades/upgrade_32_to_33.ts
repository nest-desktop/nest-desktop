// upgrade_32_to_33.ts

const validateVersion = (version: string) => /^3\.2(\.\d+)?(\w+)?$/.test(version);

// Rename model ids of activity chart panels.
const activityChartPanelModels: Record<string, string> = {
  analogSignalPlot: "analogSignalTimeSeries",
  inputAnalogSignalPlot: "inputAnalogSignalTimeSeries",
  neuronAnalogSignalPlot: "neuronAnalogSignalTimeSeries",
  spikeTimesHistogram: "spikeTimeHistogram",
};

export function upgradeProject_32_to_33(projectState: any): any {
  if (!validateVersion(projectState.version)) return projectState;

  if (
    projectState.activityGraph &&
    projectState.activityGraph.chart &&
    projectState.activityGraph.chart.panels &&
    projectState.activityGraph.chart.panels.length > 0
  ) {
    projectState.activityGraph.chart.panels.forEach((panelState: any) => {
      if (panelState.model.id in activityChartPanelModels) {
        panelState.model.id = activityChartPanelModels[panelState.model.id];
      }
    });
  }

  projectState.version = "3.3";
  return projectState;
}
