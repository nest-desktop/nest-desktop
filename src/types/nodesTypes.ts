// nodesTypes.ts

import { BaseNodes } from "@/helpers/node/baseNodes";
import { NESTNodes } from "@/simulators/nest/helpers/node/nestNodes";
import { NorseNodes } from "@/simulators/norse/helpers/node/norseNodes";

export type Nodes = BaseNodes | NESTNodes | NorseNodes;