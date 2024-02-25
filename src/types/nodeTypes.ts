// nodeTypes.ts

import { BaseNode } from "@/helpers/node/node";
import { NESTNode } from "@/simulators/nest/helpers/node/node";
import { NorseNode } from "@/simulators/norse/helpers/node/node";

export type Node = BaseNode | NESTNode | NorseNode;
export const NodePropTypes = [BaseNode, NESTNode, NorseNode];
