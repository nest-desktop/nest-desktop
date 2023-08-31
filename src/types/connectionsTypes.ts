// connectionsTypes.ts

import { BaseConnections } from "@/common/connection/baseConnections"
import { NorseConnections } from "@norse/components/connection/norseConnections"

export type Connections = BaseConnections | NorseConnections;