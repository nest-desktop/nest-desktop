// nodeTypes.ts

import { BaseNode } from "@/components/node/baseNode";
import { NESTNode } from "@nest/components/node/nestNode";
import { NorseNode } from "@norse/components/node/norseNode";

export type Node = BaseNode | NESTNode | NorseNode;
export const NodePropTypes = [BaseNode, NESTNode, NorseNode];
