// connectionTypes.ts

import { BaseConnection } from "@/helpers/connection/baseConnection";
import { NESTConnection } from "@/simulators/nest/helpers/connection/nestConnection";
import { NorseConnection } from "@/simulators/norse/helpers/connection/norseConnection";

export type Connection = BaseConnection | NESTConnection | NorseConnection;

// for connection avatar
export const ConnectionPropTypes = [
  BaseConnection,
  NESTConnection,
  NorseConnection,
];
