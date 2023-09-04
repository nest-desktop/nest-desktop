// nodeParameterTypes.ts

import { BaseNode } from "@/helpers/node/baseNode";
import { NESTCopyModel } from "@/simulators/nest/helpers/model/nestCopyModel";
import { NESTNodeCompartment } from "@/simulators/nest/helpers/node/nodeCompartment/nestNodeCompartment";
import { NESTNodeReceptor } from "@/simulators/nest/helpers/node/nodeReceptor/nestNodeReceptor";
import { NESTNode } from "@nest/helpers/node/nestNode";
import { NorseNode } from "@norse/helpers/node/norseNode";

export type NodeParameterTypes =
  | BaseNode
  | NESTNode
  | NESTCopyModel
  | NESTNodeCompartment
  | NESTNodeReceptor
  | NorseNode;
export const NodeParameterPropTypes = [
  BaseNode,
  NESTNode,
  NESTCopyModel,
  NESTNodeCompartment,
  NESTNodeReceptor,
  NorseNode,
];
