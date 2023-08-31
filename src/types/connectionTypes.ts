// connectionTypes.ts

import { BaseConnection } from "@/common/connection/baseConnection"
import { NorseConnection } from "@norse/components/connection/norseConnection"

export type Connection = BaseConnection | NorseConnection;
export const ConnectionPropTypes = [BaseConnection, NorseConnection];
