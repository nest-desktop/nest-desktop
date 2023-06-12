// upgrade_32_to_33.ts

const validateVersion = (version: string) =>
  /^3\.2(\.\d+)?(\w+)?$/.test(version);

export function upgradeProject_32_to_33(project: any): any {
  if (!validateVersion(project.version)) {
    return project;
  }

  if (
    project.activityGraph &&
    project.activityGraph.chart &&
    project.activityGraph.chart.panels &&
    project.activityGraph.chart.panels.length > 0
  ) {
    // Rename model ids of activity chart panels.
    const activityChartPanelModels = {
      analogSignalPlot: 'analogSignalTimeSeries',
      inputAnalogSignalPlot: 'inputAnalogSignalTimeSeries',
      neuronAnalogSignalPlot: 'neuronAnalogSignalTimeSeries',
      spikeTimesHistogram: 'spikeTimeHistogram',
    };

    project.activityGraph.chart.panels.forEach((panel: any) => {
      if (panel.model.id in activityChartPanelModels) {
        panel.model.id = activityChartPanelModels[panel.model.id];
      }
    });
  }

  // // Stores node params only if visible.
  // project.network.nodes.forEach((node: any) => {
  //   if (node.params) {
  //     node.params = node.params.filter((param: any) => param.visible);
  //   }
  // });
  //
  // // Stores connection params only if visible.
  // project.network.connections.forEach((connection: any) => {
  //   if (connection.params) {
  //     connection.params = connection.params.filter(
  //       (param: any) => param.visible
  //     );
  //   }
  //   if (connection.synapse && connection.synapse.params) {
  //     connection.synapse.params = connection.synapse.params.filter(
  //       (param: any) => param.visible
  //     );
  //   }
  // });

  project.version = '3.3';
  return project;
}
