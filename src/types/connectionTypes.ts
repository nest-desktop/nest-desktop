// connectionTypes.ts

import {
  BaseConnection,
  IConnectionProps,
} from "@/helpers/connection/connection";
import {
  INESTConnectionProps,
  NESTConnection,
} from "@/simulators/nest/helpers/connection/connection";
import {
  INorseConnectionProps,
  NorseConnection,
} from "@/simulators/norse/helpers/connection/connection";

export type TConnection = BaseConnection | NESTConnection | NorseConnection;
export type TConnectionProps =
  | IConnectionProps
  | INESTConnectionProps
  | INorseConnectionProps;
