// basic/interfaceTypes.ts

// Create the types. It is recommended to define them
// in a separate file and import them when creating the nodes.
import { BaklavaInterfaceTypes, NodeInterfaceType } from "@baklavajs/interface-types";
import { IBaklavaViewModel } from "baklavajs";

export const stringType = new NodeInterfaceType<string>("string");
export const numberType = new NodeInterfaceType<number>("number");
export const booleanType = new NodeInterfaceType<boolean>("boolean");
export const dictType = new NodeInterfaceType<Object>("dict");
export const listType = new NodeInterfaceType<Object>("list");

export const addBaseTypes = (baklavaView: IBaklavaViewModel) => {
  const nodeInterfaceTypes = new BaklavaInterfaceTypes(baklavaView.editor, { viewPlugin: baklavaView });
  nodeInterfaceTypes.addTypes(stringType, numberType, booleanType, dictType, listType);
};
