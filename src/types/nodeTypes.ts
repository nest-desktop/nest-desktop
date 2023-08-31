// nodeTypes.ts

import { BaseNode } from "@/common/node/baseNode";
import { NorseNode } from "@norse/components/node/norseNode";

export type Node = BaseNode | NorseNode;
export const NodePropTypes = [BaseNode, NorseNode];
