// Create the types. It is recommended to define them
// in a separate file and import them when creating the nodes.
import { NodeInterfaceType } from "@baklavajs/interface-types";

export interface IAnalogSignal {}
export const analogSignal = new NodeInterfaceType<IAnalogSignal>("analogSignal");

export interface ISpikeTrain {}
export const spikeTrain = new NodeInterfaceType<ISpikeTrain>("spikeTrain");
