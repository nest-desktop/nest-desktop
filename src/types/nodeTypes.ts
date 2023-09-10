// nodeTypes.ts

import { BaseNode } from "@/helpers/node/baseNode";
import { NESTNode } from "@/simulators/nest/helpers/node/nestNode";
import { NorseNode } from "@/simulators/norse/helpers/node/norseNode";

export type Node =
  | BaseNode
  | NESTNode
  | NorseNode;
export const NodePropTypes = [
  BaseNode,
  NESTNode,
  NorseNode,
];
