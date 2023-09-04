// nodesTypes.ts

import { BaseNodes } from "@/components/node/baseNodes";
import { NESTNodes } from "@nest/components/node/nestNodes";
import { NorseNodes } from "@norse/components/node/norseNodes";

export type Nodes = BaseNodes | NESTNodes | NorseNodes;