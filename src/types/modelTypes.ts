// modelTypes.ts

import { BaseModel } from "@/helpers/model/baseModel";
import { NorseModel } from "@norse/helpers/model/norseModel";
import { NESTModel } from "@nest/helpers/model/nestModel";
import { NESTCopyModel } from "@nest/helpers/model/nestCopyModel";

export type Model = BaseModel | NESTCopyModel | NESTModel | NorseModel;
