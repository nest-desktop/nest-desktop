// activityGraphTypes.ts

import { BaseActivityGraph } from "@/helpers/activity/activityGraph";
import { NESTActivityGraph } from "@/simulators/nest/helpers/activity/activityGraph";

export type TActivityGraph = BaseActivityGraph | NESTActivityGraph;
