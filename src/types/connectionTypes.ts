// connectionTypes.ts

import { BaseConnection } from "@/components/connection/baseConnection";
import { NESTConnection } from "@nest/components/connection/nestConnection";
import { NorseConnection } from "@norse/components/connection/norseConnection";

export type Connection = BaseConnection | NESTConnection | NorseConnection;
