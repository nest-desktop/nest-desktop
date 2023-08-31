// modelTypes.ts

import { BaseModel } from "@/common/model/baseModel";
import { NorseModel } from "@norse/components/model/norseModel";

export type Model = BaseModel | NorseModel;
export const ModelPropTypes = [BaseModel, NorseModel];
