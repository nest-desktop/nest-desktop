// nodesTypes.ts

import { BaseNodes } from "@/helpers/node/baseNodes";
import { NESTNodes } from "@nest/helpers/node/nestNodes";
import { NorseNodes } from "@norse/helpers/node/norseNodes";

export type Nodes = BaseNodes | NESTNodes | NorseNodes;