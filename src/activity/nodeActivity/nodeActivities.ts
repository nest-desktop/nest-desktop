// nodeActivities.ts

import type { NetworkProject } from "@/project";
import type { TNode } from "@/types";

import type { Activity } from "../helpers/activity";
import { Activities } from "../helpers/activities";

import type { NodeActivity } from "./nodeActivity";
import type { NodeAnalogSignalActivity } from "./nodeAnalogSignalActivity";
import type { NodeSpikeActivity } from "./nodeSpikeActivity";

export class NodeActivities extends Activities {
  /**
   * Get all activities.
   */
  override get all(): NodeActivity[] {
    let activities = [] as NodeActivity[];

    activities = this.project.network.nodes.recorders.map((recorder: TNode) => recorder.activity as NodeActivity);

    // Update activity idx.
    if (activities.length > 0)
      activities
        .filter((activity: NodeActivity) => activity)
        .forEach((activity: NodeActivity, idx: number) => (activity.idx = idx));

    return activities;
  }

  /**
   * Get a list of analog signal activities.
   */
  override get analogSignals(): NodeAnalogSignalActivity[] {
    const activities: NodeAnalogSignalActivity[] =
      "network" in this.project
        ? this.project.network?.nodes.recordersAnalog.map(
            (recorder: TNode) => recorder.activity as NodeAnalogSignalActivity,
          )
        : [];
    activities.forEach((activity: Activity, idx: number) => (activity.idx = idx));
    return activities;
  }

  /**
   * Get a list of neuronal analog signal activities.
   */
  get neuronAnalogSignals(): NodeAnalogSignalActivity[] {
    return this.analogSignals.filter((activity: NodeAnalogSignalActivity) => activity.hasNeuronAnalogData);
  }

  /**
   * Get a list of input analog signal activities.
   */
  get inputAnalogSignals(): NodeAnalogSignalActivity[] {
    return this.analogSignals.filter((activity: NodeAnalogSignalActivity) => activity.hasInputAnalogData);
  }

  get project(): NetworkProject {
    return super.project as NetworkProject;
  }

  /**
   * Get a list of spike activities.
   */
  override get spikes(): NodeSpikeActivity[] {
    const activities: NodeSpikeActivity[] =
      "network" in this.project
        ? this.project.network.nodes.recordersSpike.map((recorder: TNode) => recorder.activity as NodeSpikeActivity)
        : [];
    activities.forEach((activity: NodeSpikeActivity, idx: number) => (activity.idx = idx));
    return activities;
  }

  /**
   * Check whether the project has some recorders of each type.
   */
  checkRecorders(): void {
    if (!this.project.network) return;
    this.logger.trace("check recorders");

    // Check if the project contains some analog signal recorder.
    this.state.hasSomeAnalogRecorders = this.project.network.nodes.hasSomeAnalogRecorders;

    // Check if the project contains some spike recorder.
    this.state.hasSomeSpikeRecorders = this.project.network.nodes.hasSomeSpikeRecorders;
  }

  // Initialize activities.
  override init(): void {
    this.logger.trace("init");

    this.checkRecorders();
  }
}
