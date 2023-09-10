// connectionsTypes.ts

import { BaseConnections } from "@/helpers/connection/baseConnections";
import { NESTConnections } from "@/simulators/nest/helpers/connection/nestConnections";
import { NorseConnections } from "@/simulators/norse/helpers/connection/norseConnections";

export type Connections = BaseConnections | NESTConnections | NorseConnections;
