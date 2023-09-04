// connectionTypes.ts

import { BaseConnection } from "@/helpers/connection/baseConnection";
import { NESTConnection } from "@nest/helpers/connection/nestConnection";
import { NorseConnection } from "@norse/helpers/connection/norseConnection";

export type Connection = BaseConnection | NESTConnection | NorseConnection;
