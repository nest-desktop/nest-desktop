// activities.ts

import { UnwrapRef, reactive } from "vue";

import { Activity, IActivityProps, IEventProps } from "./activity";
import { AnalogSignalActivity } from "./analogSignalActivity";
import { BaseObj } from "../common/base";
import { SpikeActivity } from "../activity/spikeActivity";
import { TNode } from "@/types/nodeTypes";
import { TProject } from "@/types/projectTypes";

interface IActivitiesState {
  activityStatsPanelId: number;
  hasSomeAnalogRecorders: boolean;
  hasSomeEvents: boolean;
  hasSomeSpatialActivities: boolean;
  hasSomeSpikeRecorders: boolean;
}

export class Activities extends BaseObj {
  private _state: UnwrapRef<IActivitiesState>;
  public _project: TProject;

  constructor(project: TProject) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._project = project;
    this._state = reactive({
      activityStatsPanelId: 0,
      hasSomeAnalogRecorders: false,
      hasSomeEvents: false,
      hasSomeSpatialActivities: false,
      hasSomeSpikeRecorders: false,
    });

    this.checkRecorders();
  }

  /**
   * Get a list of activities.
   */
  get all(): Activity[] {
    // @ts-ignore
    const activities: Activity[] = this._project.network
      ? this.project.network.nodes.recorders.map(
          (recorder: TNode) => recorder.activity
        )
      : ([] as Activity[]);

    if (activities) {
      activities.forEach((activity: Activity, idx: number) => {
        if (activity) {
          activity.idx = idx;
        }
      });
    }
    return activities;
  }

  /**
   * Get a list of analog signal activities.
   */
  get analogSignals(): AnalogSignalActivity[] {
    const activities: AnalogSignalActivity[] = this._project.network
      ? this.project.network.nodes.recordersAnalog.map(
          (recorder: TNode) => recorder.activity as AnalogSignalActivity
        )
      : [];
    activities.forEach((activity: Activity, idx: number) => {
      activity.idx = idx;
    });
    return activities;
  }

  /**
   * Get a list of neuronal analog signal activities.
   */
  get neuronAnalogSignals(): AnalogSignalActivity[] {
    return this.analogSignals.filter(
      (activity: AnalogSignalActivity) => activity.hasNeuronAnalogData
    );
  }

  /**
   * Get a list of input analog signal activities.
   */
  get inputAnalogSignals(): AnalogSignalActivity[] {
    return this.analogSignals.filter(
      (activity: AnalogSignalActivity) => activity.hasInputAnalogData
    );
  }

  get project(): TProject {
    return this._project;
  }

  /**
   * Get a list of spike activities.
   */
  get spikes(): SpikeActivity[] {
    const activities: SpikeActivity[] = this._project.network
      ? this.project.network.nodes.recordersSpike.map(
          (recorder: TNode) => recorder.activity as SpikeActivity
        )
      : [];
    activities.forEach((activity: Activity, idx: number) => {
      activity.idx = idx;
    });
    return activities;
  }

  get state(): UnwrapRef<IActivitiesState> {
    return this._state;
  }

  /**
   * Observer for activities changes.
   *
   * @remarks
   * It checks activities.
   * It updates hash.
   * It updates activity graph.
   */
  changes(): void {
    // Check if project has activities.
    this.checkActivities();
    this.updateHash();
    this.logger.trace("changes");

    // Update activity graph.
    // const activityGraphStore = useActivityGraphStore()
    // activityGraphStore.update();
    this._project.activityGraph.update();
  }

  /**
   * Check whether the project has some events in activities.
   */
  checkActivities(): void {
    this.logger.trace("check");
    const activities: Activity[] = this._project.activities.all;

    // Check if it has some activities.
    this._state.hasSomeEvents =
      activities.length > 0
        ? activities.some((activity: Activity) => activity.hasEvents)
        : false;

    // Check if it has spatial activities.
    this._state.hasSomeSpatialActivities = this._state.hasSomeEvents
      ? activities.some(
          (activity: Activity) =>
            activity.hasEvents && activity.nodePositions.length > 0
        )
      : false;
  }

  /**
   * Check whether the project has some recorders of each type.
   */
  checkRecorders(): void {
    this.logger.trace("check recorders");

    // Check if the project contains some analog signal recorder.
    this._state.hasSomeAnalogRecorders =
      this.project.network.nodes.recordersAnalog.length > 0;

    // Check if the project contains some spike recorder.
    this._state.hasSomeSpikeRecorders =
      this.project.network.nodes.recordersSpike.length > 0;
  }

  // Initialize activities.
  init(): void {
    this.checkRecorders();
  }

  /**
   * Reset activities.
   */
  reset(): void {
    this.logger.trace("reset");
    // Reset activities.
    this.all.forEach((activity: Activity) => activity.reset());

    // Trigger activity changes.
    // this.changes();
  }

  toJSON(): IActivityProps[] {
    return this.all.map((activity: Activity) => activity.toJSON());
  }

  /**
   * Update activities in recorder nodes after simulation.
   */
  update(
    data:
      | IActivityProps[]
      | {
          activities: IActivityProps[];
          events: IEventProps[];
          positions: { [key: string]: number[] };
        }
  ): void {
    this.logger.trace("update");
    let activitiesProps: IActivityProps[] = [];

    if ("events" in data) {
      activitiesProps = data.events.map((eventProps: IEventProps) => ({
        events: eventProps,
      }));
    } else if ("activities" in data) {
      activitiesProps = data.activities as IActivityProps[];
    } else {
      activitiesProps = data;
    }

    activitiesProps.forEach((activityProps: IActivityProps) => {
      if (!activityProps.nodeIds) {
        if (activityProps.events && activityProps.events.ports) {
          activityProps.nodeIds = activityProps.events.ports.filter(
            (value: number, index: number, self: number[]) =>
              self.indexOf(value) === index
          );
        } else {
          activityProps.nodeIds = activityProps.events?.senders.filter(
            (value: number, index: number, self: number[]) =>
              self.indexOf(value) === index
          );
        }
      }
      activityProps.nodeIds?.sort((a: number, b: number) => a - b);
    });

    // Get node positions.
    if ("positions" in data) {
      activitiesProps.forEach((activityProps: IActivityProps) => {
        activityProps.nodePositions = activityProps.nodeIds?.map(
          (nodeId: number) => data.positions[nodeId] as number[]
        );
      });
    }

    // Initialize recorded activities.
    this.all.forEach((activity: Activity, idx: number) => {
      activity.init(activitiesProps[idx]);
    });

    // Trigger activity changes.
    this.changes();
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._updateHash({
      activities: this._project.activities.all.map(
        (activity: Activity) => activity.hash
      ),
    });
  }
}
