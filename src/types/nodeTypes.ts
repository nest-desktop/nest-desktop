// nodeTypes.ts

import { BaseNode } from "@/helpers/node/node";
import { NESTNode } from "@/simulators/nest/helpers/node/node";
import { NorseNode } from "@/simulators/norse/helpers/node/node";

export type TNode = BaseNode | NESTNode | NorseNode;

// for components
export const TNodeProps = [BaseNode, NESTNode, NorseNode];
