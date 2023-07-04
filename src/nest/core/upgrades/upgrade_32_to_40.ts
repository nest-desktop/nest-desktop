// upgrade_32_to_40.ts

const validateVersion = (version: string) =>
  /^3\.2(\.\d+)?(\w+)?$/.test(version);

const upgradeParams = (oldParams: any[]) => {
  const newParams: { [key: string]: any } = {};
  oldParams
    .filter((param: any) => param.visible !== false)
    .forEach((param: any) => {
      if (param.type) {
        newParams[param.id] = param.type;
      } else {
        newParams[param.id] = param.value;
      }
    });
  return newParams;
};

export function upgradeProject_32_to_40(project: any): any {
  // if (!validateVersion(project.version)) {
  //   return project;
  // }

  console.log('Upgrade to 4.0')

  // Upgrade node params.
  // project.network.nodes
  //   .filter((node: any) => node.params && Array.isArray(node.params))
  //   .forEach((node: any) => {
  //     node.params = upgradeParams(node.params);
  //   });

  // // Upgrade connection params.
  // project.network.connections
  //   .filter((connection: any) => connection.paramss && Array.isArray(connection.params))
  //   .forEach((connection: any) => {
  //     connection.params = upgradeParams(connection.params);
  //   });

  // // Upgrade synapse params.
  // project.network.connections
  //   .filter((connection: any) => connection.synapse?.params && Array.isArray(connection.synapse.params))
  //   .forEach((connection: any) => {
  //     connection.synapse.params = upgradeParams(connection.synapse.params);
  //   });

  project.version = "4.0";
  return project;
}
