// connectionsTypes.ts

import { BaseConnections } from "@/helpers/connection/baseConnections";
import { NESTConnections } from "@nest/helpers/connection/nestConnections";
import { NorseConnections } from "@norse/helpers/connection/norseConnections";

export type Connections = BaseConnections | NESTConnections | NorseConnections;
