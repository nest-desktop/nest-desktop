import { App } from '../app';
import { Model } from '../model/model';

/**
 * Data structure changed in 2.5
 */
function upgradeNetwork(app: App, project: any): any {
  // console.log('Upgrade network:', project.name);
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
      model: typeof simModel === 'string' ? simModel : simModel.existing,
      view,
    };
    if (simNode.hasOwnProperty('spatial')) {
      node.spatial = simNode.spatial;
      if (node.spatial.hasOwnProperty('rows')) {
        node.spatial.shape = [node.spatial.rows, node.spatial.columns];
      }
      if (node.spatial.hasOwnProperty('positions')) {
        node.spatial.pos = node.spatial.positions;
      }
    }
    network.nodes.push(node);
  });

  // Object.entries(project.simulation.models).map((item: any) => {
  //   const model: any = this.copy(item[1]);
  //   model['id'] = item[0];
  //   model['params'] = Object.entries(model.params).map((p: any) => {
  //     return {
  //       id: p[0],
  //       value: p[1],
  //     }
  //   })
  //   network.models.push(model)
  // })

  project.simulation.connectomes.forEach((simLink: any) => {
    const connection: any = {
      source: simLink.source !== undefined ? simLink.source : simLink.pre,
      target: simLink.target !== undefined ? simLink.target : simLink.post,
    };
    if (simLink.hasOwnProperty('conn_spec')) {
      connection.rule = simLink.conn_spec.rule || 'all_to_all';
      connection.params = Object.entries(simLink.conn_spec)
        .filter((spec: any[]) => spec[0] !== 'rule')
        .map((param: any[]) => ({ id: param[0], value: param[1] }));
    }
    const synapse: any = {
      params: [],
    };
    const synModel: Model = app.getModel(synapse.model || 'static_synapse');
    if (simLink.hasOwnProperty('syn_spec')) {
      synModel.params.forEach((modelParam: any) => {
        const simParam: any = simLink.syn_spec[modelParam.id];
        const param: any = {
          id: modelParam.id,
          value: simParam !== undefined ? simParam : modelParam.value,
          visible: simParam !== undefined,
        };
        synapse.params.push(param);
      });
    }
    connection.synapse = synapse;
    network.connections.push(connection);
  });

  // console.log(network);
  return network;
}

/**
 * Make projects compatible.
 */
export function upgradeProject(app: App, project: any): any {
  // console.log('Upgrade project:', project.name);
  if (Object.keys(project).length === 0) {
    return {};
  }

  if (!project.hasOwnProperty('version')) {
    return project;
  }
  const version: string[] = project.version.split('.');

  // checks when version is 2.5 or newer.
  const valid_2_5: boolean =
    (Number(version[0]) === 2 && Number(version[1]) >= 5) ||
    Number(version[0]) > 2;
  const network: any = valid_2_5
    ? project.network
    : upgradeNetwork(app, project);

  // checks when version is 3.0 or newer.
  const valid_3: boolean = Number(version[0]) === 3;
  if (!valid_3) {
    network.nodes
      .filter((node: any) => node.model === 'spike_detector')
      .forEach((node: any) => {
        node.model = 'spike_recorder';
      });
    network.connections.forEach((connection: any) => {
      connection.params.map((param: any) => {
        param.visible = true;
      });
    });
  }

  return { network, simulation: project.simulation };
}
