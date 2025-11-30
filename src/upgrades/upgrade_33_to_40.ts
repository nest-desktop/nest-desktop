// upgrade_33_to_40.ts

const validateVersion = (version: string) => /^3\.3(\.\d+)?(\w+)?$/.test(version);

function upgradeParams(state: any): void {
  if (!state.params) return;

  state.params = state.params.filter((paramState: any) => ("visible" in paramState ? paramState.visible : true));

  if (state.params.length === 0) {
    delete state.params;
    return;
  }

  state.params = state.params.map((paramState: any) => {
    const newParamState: any = {
      id: paramState.id,
    };

    if (paramState.specs) {
      newParamState.specs = paramState.specs;
    } else {
      newParamState.value = paramState.value;
    }

    return newParamState;
  });
}

export function upgradeProject_33_to_40(projectState: any): any {
  if (!validateVersion(projectState.version)) return projectState;

  if (projectState.activityGraph) {
    projectState.activityGraph.color = "record";
    projectState.activityGraph.panels.forEach((panelState: any) => {
      if (!panelState.model.records) return;

      panelState.model.records = panelState.model.records.map((recordState: any) => {
        const groupId = recordState.groupId;
        const groupIdSplitted = groupId.split(".");
        groupIdSplitted.reverse();
        return groupIdSplitted.join(".");
      });
    });
  }

  projectState.network.nodes.forEach((nodeState: any) => upgradeParams(nodeState));

  projectState.network.connections.forEach((connectionState: any) => {
    upgradeParams(connectionState);
    if (connectionState.synapse) upgradeParams(connectionState.synapse);
  });

  if (projectState.network.models) {
    projectState.network.models.forEach((modelState: any) => upgradeParams(modelState));
  }

  projectState.version = "4.0";
  return projectState;
}
