// Create the types. It is recommended to define them
// in a separate file and import them when creating the nodes.
import { NodeInterfaceType } from "@baklavajs/interface-types";

export interface IIAFParameters {}
export const iafParametersType = new NodeInterfaceType<IIAFParameters>("IAFParameters");

export interface ILIFParameters {}
export const lifParametersType = new NodeInterfaceType<ILIFParameters>("LIFParameters");

export interface ILIParameters {}
export const liParametersType = new NodeInterfaceType<ILIParameters>("LIParameters");
