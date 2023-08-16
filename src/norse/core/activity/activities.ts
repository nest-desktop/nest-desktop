// activities.ts

import { ILogObj, Logger } from "tslog";
import { UnwrapRef, reactive } from "vue";
import { sha1 } from "object-hash";

import { logger as mainLogger } from "@/utils/logger";

import { Activity } from "./activity";
import { Node } from "../node/node";
import { Project } from "../project/project";
import { AnalogSignalActivity } from "./analogSignalActivity";
import { SpikeActivity } from "./spikeActivity";
// import { useActivityGraphStore } from "@norse/store/graph/activityGraphStore";

interface ActivitiesState {
  hasSomeAnalogRecorders: boolean;
  hasSomeEvents: boolean;
  hasSomeSpatialActivities: boolean;
  hasSomeSpikeRecorders: boolean;
  hash: string;
}

export class Activities {
  private _project: Project;
  private _logger: Logger<ILogObj>;
  private _state: UnwrapRef<ActivitiesState>;

  constructor(project: Project) {
    this._project = project;
    this._state = reactive({
      hasSomeAnalogRecorders: false,
      hasSomeEvents: false,
      hasSomeSpatialActivities: false,
      hasSomeSpikeRecorders: false,
      hash: "",
    });

    this._logger = mainLogger.getSubLogger({
      name: `[${this._project.shortId}] activities`,
    });

    this.checkRecorders();
  }

  /**
   * Get a list of activities.
   */
  get all(): Activity[] {
    this._logger.trace("all");
    // @ts-ignore
    const activities: Activity[] = this._project.network
      ? this._project.network.nodes.recorders.map(
          (recorder: Node) => recorder.activity
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
      ? this._project.network.nodes.recordersAnalog.map(
          (recorder: Node) => recorder.activity as AnalogSignalActivity
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

  /**
   * Get a list of spike activities.
   */
  get spikes(): SpikeActivity[] {
    const activities: SpikeActivity[] = this._project.network
      ? this._project.network.nodes.recordersSpike.map(
          (recorder: Node) => recorder.activity as SpikeActivity
        )
      : [];
    activities.forEach((activity: Activity, idx: number) => {
      activity.idx = idx;
    });
    return activities;
  }

  get state(): UnwrapRef<ActivitiesState> {
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
    this._logger.trace("changes");

    // Update activity graph.
    // const activityGraphStore = useActivityGraphStore()
    // activityGraphStore.update();
    this._project.activityGraph.update();
  }

  /**
   * Check whether the project has some recorders of each type.
   */
  checkRecorders(): void {
    this._logger.trace("check recorders");

    // Check if the project contains some analog signal recorder.
    this._state.hasSomeAnalogRecorders =
      this._project.network.nodes.recordersAnalog.length > 0;

    // Check if the project contains some spike recorder.
    this._state.hasSomeSpikeRecorders =
      this._project.network.nodes.recordersSpike.length > 0;
  }

  /**
   * Check whether the project has some events in activities.
   */
  checkActivities(): void {
    const activities: Activity[] = this._project.activities.all;

    // Check if it has some activities.
    this._state.hasSomeEvents =
      activities.length > 0
        ? activities.some((activity: Activity) => activity.hasEvents)
        : false;

  }

  /**
   * Reset activities.
   */
  reset(): void {
    // Reset activities.
    this.all.forEach((activity: Activity) => {
      activity.reset();
    });

    // Trigger activity changes.
    // this.changes();
  }

  toJSON(): any {
    return this.all.map((activity: Activity) => activity.toJSON());
  }

  /**
   * Update activities in recorder nodes after simulation.
   */
  update(data: any): void {
    this._logger.trace("update");
    let activities: any[] = [];

    if (data.events) {
      activities = data.events.map((events: any) => ({
        events,
      }));
    } else if (data.activities) {
      activities = data.activities;
    } else {
      activities = data;
    }

    activities.forEach((activity: any) => {
      if (!activity.nodeIds) {
        if (activity.events && activity.events.ports) {
          activity.nodeIds = activity.events.ports.filter(
            (value: number, index: number, self: number[]) =>
              self.indexOf(value) === index
          );
        } else {
          activity.nodeIds = activity.events.senders.filter(
            (value: number, index: number, self: number[]) =>
              self.indexOf(value) === index
          );
        }
      }
      activity.nodeIds.sort((a: number, b: number) => a - b);
    });

    // Get node positions.
    if (data.positions) {
      activities.forEach((activity: any) => {
        activity.nodePositions = activity.nodeIds.map(
          (nodeId: number) => data.positions[nodeId]
        );
      });
    }

    // Initialize recorded activities.
    this.all.forEach((activity: Activity, idx: number) => {
      activity.init(activities[idx]);
    });

    // Trigger activity changes.
    this.changes();
  }

  /**
   * Update hash for activity graph.
   */
  updateHash(): void {
    this._state.hash = sha1({
      activities: this._project.activities.all.map(
        (activity: Activity) => activity.state.hash
      ),
    }).slice(0, 6);
    this._logger.settings.name = `[${this._project.shortId}] activities #${this._state.hash}`;
  }
}
