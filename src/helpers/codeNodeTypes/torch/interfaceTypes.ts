// Create the types. It is recommended to define them
// in a separate file and import them when creating the nodes.
import { NodeInterfaceType } from "@baklavajs/interface-types";

export interface ITorchTensor {}
export const torchTensorType = new NodeInterfaceType<ITorchTensor>("torchTensor");
