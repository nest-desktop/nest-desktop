// upgrade_32_to_33.ts

const validateVersion = (version: string) => /^3\.2(\.\d+)?(\w+)?$/.test(version);

// Rename model ids of activity chart panels.
const activityChartPanelModels: Record<string, string> = {
  analogSignalPlot: "analogSignalTimeSeries",
  inputAnalogSignalPlot: "inputAnalogSignalTimeSeries",
  neuronAnalogSignalPlot: "neuronAnalogSignalTimeSeries",
  spikeTimesHistogram: "spikeTimeHistogram",
};

export function upgradeProject_32_to_33(projectProps: any): any {
  if (!validateVersion(projectProps.version)) return projectProps;

  if (
    projectProps.activityGraph &&
    projectProps.activityGraph.chart &&
    projectProps.activityGraph.chart.panels &&
    projectProps.activityGraph.chart.panels.length > 0
  ) {
    projectProps.activityGraph.chart.panels.forEach((panelProps: any) => {
      if (panelProps.model.id in activityChartPanelModels) {
        panelProps.model.id = activityChartPanelModels[panelProps.model.id];
      }
    });
  }

  projectProps.version = "3.3";
  return projectProps;
}
