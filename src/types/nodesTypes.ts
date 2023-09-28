// nodesTypes.ts

import { BaseNodes } from "@/helpers/node/nodes";
import { NESTNodes } from "@/simulators/nest/helpers/node/nodes";
import { NorseNodes } from "@/simulators/norse/helpers/node/nodes";

export type Nodes = BaseNodes | NESTNodes | NorseNodes;