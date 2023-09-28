// connectionTypes.ts

import { BaseConnection } from "@/helpers/connection/connection";
import { NESTConnection } from "@/simulators/nest/helpers/connection/connection";
import { NorseConnection } from "@/simulators/norse/helpers/connection/connection";

export type Connection = BaseConnection | NESTConnection | NorseConnection;

// for connection avatar
export const ConnectionPropTypes = [
  BaseConnection,
  NESTConnection,
  NorseConnection,
];
