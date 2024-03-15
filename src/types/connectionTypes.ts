// connectionTypes.ts

import { BaseConnection } from "@/helpers/connection/connection";
import { NESTConnection } from "@/simulators/nest/helpers/connection/connection";
import { NorseConnection } from "@/simulators/norse/helpers/connection/connection";

export type TConnection = BaseConnection | NESTConnection | NorseConnection;

// for components
export const TConnectionProps = [
  BaseConnection,
  NESTConnection,
  NorseConnection,
];
