// connectionsTypes.ts

import { BaseConnections } from "@/components/connection/baseConnections";
import { NESTConnections } from "@nest/components/connection/nestConnections";
import { NorseConnections } from "@norse/components/connection/norseConnections";

export type Connections = BaseConnections | NESTConnections | NorseConnections;
