// Create the types. It is recommended to define them
// in a separate file and import them when creating the nodes.
import { NodeInterfaceType } from "@baklavajs/interface-types";

export interface INESTNodeCollection {
  data?: unknown;
}
export const nestNodeCollectionType = new NodeInterfaceType<INESTNodeCollection>("nestNodeCollection");

export interface INESTSynapseCollection {
  data?: unknown;
}
export const nestSynapseCollectionType = new NodeInterfaceType<INESTSynapseCollection>("nestSynapseCollection");
