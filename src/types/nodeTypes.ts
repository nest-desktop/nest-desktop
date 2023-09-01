// nodeTypes.ts

import { BaseNode } from "@/common/node/baseNode";
import { NESTNode } from "@/plugins/nest/core/node/nestNode";
import { NorseNode } from "@norse/components/node/norseNode";

export type Node = BaseNode | NESTNode | NorseNode;
export const NodePropTypes = [BaseNode, NESTNode, NorseNode];
