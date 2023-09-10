// nodeParameterTypes.ts

import { BaseNode } from "@/helpers/node/baseNode";

import { NESTCopyModel } from "@/simulators/nest/helpers/model/nestCopyModel";
import { NESTNode } from "@/simulators/nest/helpers/node/nestNode";
import { NESTNodeCompartment } from "@/simulators/nest/helpers/node/nodeCompartment/nestNodeCompartment";
import { NESTNodeReceptor } from "@/simulators/nest/helpers/node/nodeReceptor/nestNodeReceptor";

import { NorseNode } from "@/simulators/norse/helpers/node/norseNode";

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
