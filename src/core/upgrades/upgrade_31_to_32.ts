export function upgradeProject_31_to_32(project: any): any {
  if (!/^[0-3]\.[0-1]+(.\d+)?$/.test(project.version)) {
    return project;
  }

  // // Stores params only if visible.
  // project.network.nodes.forEach((node: any) => {
  //   if (node.params) {
  //     node.params = node.params.filter((param: any) => param.visible);
  //   }
  // });
  //
  // // Stores params only if visible.
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

  project.version = '3.2.0';
  return project;
}
