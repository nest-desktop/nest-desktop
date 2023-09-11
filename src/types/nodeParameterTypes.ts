// nodeParameterTypes.ts

import { BaseNode } from "@/helpers/node/node";

import { NESTCopyModel } from "@/simulators/nest/helpers/model/copyModel";
import { NESTNode } from "@/simulators/nest/helpers/node/node";
import { NESTNodeCompartment } from "@/simulators/nest/helpers/node/nodeCompartment/nodeCompartment";
import { NESTNodeReceptor } from "@/simulators/nest/helpers/node/nodeReceptor/nodeReceptor";

import { NorseNode } from "@/simulators/norse/helpers/node/node";

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
