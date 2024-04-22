// nodeTypes.ts

import { BaseNode, INodeProps } from "@/helpers/node/node";
import { INESTNodeProps, NESTNode } from "@/simulators/nest/helpers/node/node";
import {
  INorseNodeProps,
  NorseNode,
} from "@/simulators/norse/helpers/node/node";

export type TNode = BaseNode | NESTNode | NorseNode;
export type TNodeProps = INodeProps | INESTNodeProps | INorseNodeProps;
