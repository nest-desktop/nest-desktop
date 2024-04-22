// nodeParameterTypes.ts

import { BaseNode, INodeProps } from "@/helpers/node/node";

import {
  INESTCopyModelProps,
  NESTCopyModel,
} from "@/simulators/nest/helpers/model/copyModel";
import { INESTNodeProps, NESTNode } from "@/simulators/nest/helpers/node/node";
import {
  INESTNodeCompartmentProps,
  NESTNodeCompartment,
} from "@/simulators/nest/helpers/node/nodeCompartment/nodeCompartment";
import {
  INESTNodeReceptorProps,
  NESTNodeReceptor,
} from "@/simulators/nest/helpers/node/nodeReceptor/nodeReceptor";

import {
  INorseNodeProps,
  NorseNode,
} from "@/simulators/norse/helpers/node/node";

export type TNodeParameter =
  | BaseNode
  | NESTNode
  | NESTCopyModel
  | NESTNodeCompartment
  | NESTNodeReceptor
  | NorseNode;

export type TNodeParameterComponentProps =
  | INodeProps
  | INESTNodeProps
  | INESTCopyModelProps
  | INESTNodeCompartmentProps
  | INESTNodeReceptorProps
  | INorseNodeProps;
