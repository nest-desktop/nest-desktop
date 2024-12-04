// upgrade_33_to_40.ts

const validateVersion = (version: string) => /^3\.3(\.\d+)?(\w+)?$/.test(version);

function upgradeParams(props: any): void {
  if (!props.params) return;

  props.params = props.params.filter((paramProps: any) => ("visible" in paramProps ? paramProps.visible : true));

  if (props.params.length === 0) {
    delete props.params;
    return;
  }

  props.params = props.params.map((paramProps: any) => {
    const newParamProps: any = {
      id: paramProps.id,
    };

    if (paramProps.specs) {
      newParamProps.specs = paramProps.specs;
    } else {
      newParamProps.value = paramProps.value;
    }

    return newParamProps;
  });
}

export function upgradeProject_33_to_40(projectProps: any): any {
  if (!validateVersion(projectProps.version)) return projectProps;

  if (projectProps.activityGraph) {
    projectProps.activityGraph.color = "record";
    projectProps.activityGraph.panels.forEach((panelProps: any) => {
      if (!panelProps.model.records) return;

      panelProps.model.records = panelProps.model.records.map((recordProps: any) => {
        const groupId = recordProps.groupId;
        const groupIdSplitted = groupId.split(".");
        groupIdSplitted.reverse();
        return groupIdSplitted.join(".");
      });
    });
  }

  projectProps.network.nodes.forEach((nodeProps: any) => upgradeParams(nodeProps));

  projectProps.network.connections.forEach((connectionProps: any) => {
    upgradeParams(connectionProps);
    if (connectionProps.synapse) upgradeParams(connectionProps.synapse);
  });

  if (projectProps.network.models) {
    projectProps.network.models.forEach((modelProps: any) => upgradeParams(modelProps));
  }

  projectProps.version = "4.0";
  return projectProps;
}
