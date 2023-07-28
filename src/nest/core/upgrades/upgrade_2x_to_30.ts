// upgrade_2x_to_30.ts

const validateVersion = (version: string) =>
  /^2\.\d+(\.\d+)?(\w+)?$/.test(version);

const StaticSynapseParams = [
  {
    id: "weight",
    variant: "valueSlider",
    label: "synaptic weight",
    max: 100,
    min: -100,
    step: 1,
    unit: "pA",
    value: 1,
  },
  {
    id: "delay",
    variant: "valueSlider",
    label: "synaptic delay",
    max: 100,
    min: 1,
    step: 1,
    unit: "ms",
    value: 1,
  },
];

/**
 * Upgrades networks which were created with NEST Desktop v2.5 or older to be
 * compatible with >= v3.0 (the data structure changed in v2.5).
 * @param project Project which should be transformed
 * @returns Network changed to new format
 */
function upgradeNetwork_2x_to_30(project: any): any {
  const network: any = {
    nodes: [],
    connections: [],
  };
  if (Object.keys(project).length === 0) {
    return network;
  }

  project.app.nodes.forEach((appNode: any) => {
    const simNode: any = project.simulation.collections[appNode.idx];
    const simModel: any = project.simulation.models[simNode.model];
    const appModel: any = project.app.models[simNode.model];
    const params: any[] = Object.entries(simModel.params).map(
      (param: any[]) => ({
        id: param[0],
        value: param[1],
        visible: appModel ? appModel.display.includes(param[0]) : false,
      })
    );
    const view: any = {
      elementType: simNode.element_type,
      color: appNode.color,
      position: appNode.position,
    };
    const node: any = {
      idx: appNode.idx,
      params,
      size: simNode.n || 1,
      model: typeof simModel === "string" ? simModel : simModel.existing,
      view,
    };
    if ("spatial" in simNode) {
      node.spatial = simNode.spatial;
      if ("rows" in node.spatial) {
        node.spatial.shape = [node.spatial.rows, node.spatial.columns];
      }
      if ("positions" in node.spatial) {
        node.spatial.pos = node.spatial.positions;
      }
    }
    network.nodes.push(node);
  });

  project.simulation.connectomes.forEach((simLink: any) => {
    const connection: any = {
      source: simLink.source != null ? simLink.source : simLink.pre,
      target: simLink.target != null ? simLink.target : simLink.post,
    };
    if ("conn_spec" in simLink) {
      connection.rule = simLink.conn_spec.rule || "all_to_all";
      connection.params = Object.entries(simLink.conn_spec)
        .filter((spec: any[]) => spec[0] !== "rule")
        .map((param: any[]) => ({ id: param[0], value: param[1] }));
    }
    const synapse: any = {
      params: [],
    };
    if ("syn_spec" in simLink) {
      StaticSynapseParams.forEach((modelParam: any) => {
        const simParam: any = simLink.syn_spec[modelParam.id];
        const param: any = {
          id: modelParam.id,
          value: simParam != null ? simParam : modelParam.value,
          visible: simParam != null,
        };
        synapse.params.push(param);
      });
    }
    connection.synapse = synapse;
    network.connections.push(connection);
  });

  network.nodes
    .filter((node: any) => node.model === "spike_detector")
    .forEach((node: any) => {
      node.model = "spike_recorder";
    });
  network.connections.forEach((connection: any) => {
    connection.params.map((param: any) => {
      param.visible = true;
    });
  });

  return network;
}

export function upgradeProject_2x_to_30(
  project: any
): any {
  if (!validateVersion(project.version)) {
    return project;
  }

  return {
    activityGraph: project.activityGraph || {},
    network: upgradeNetwork_2x_to_30(project),
    simulation: project.simulation,
    version: "3.0",
  };
}
