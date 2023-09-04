// modelTypes.ts

import { BaseModel } from "@/components/model/baseModel";
import { NorseModel } from "@norse/components/model/norseModel";
import { NESTModel } from "@nest/components/model/nestModel";
import { NESTCopyModel } from "@nest/components/model/nestCopyModel";

export type Model = BaseModel | NESTCopyModel | NESTModel | NorseModel;
