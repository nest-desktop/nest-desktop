// connectionsTypes.ts

import { BaseConnections } from "@/helpers/connection/connections";
import { NESTConnections } from "@/simulators/nest/helpers/connection/connections";
import { NorseConnections } from "@/simulators/norse/helpers/connection/connections";

export type Connections = BaseConnections | NESTConnections | NorseConnections;
