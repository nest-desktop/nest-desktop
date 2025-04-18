// insite.ts

import { AxiosResponse } from "axios";

import { AnalogSignalActivity } from "@/helpers/activity/analogSignalActivity";
import { IActivityProps, IEventProps } from "@/helpers/activity/activity";
import { NodeSpikeActivity } from "@/helpers/nodeActivity/nodeSpikeActivity";
import { notifySuccess } from "@/helpers/common/notification";

import insiteAccess from "../../stores/backends/insiteAccessStore";
import { NESTProject } from "../project/project";
import { BaseObj } from "@/helpers/common/base";

interface IInsiteActivityProps extends IActivityProps {
  times: number[];
}

interface IInsiteMultimeterResponseData {
  attributes: string[];
  multimeterId: number;
  nodeIds: number[];
}

interface IInsiteSpikeRecorderResponseData {
  nodeIds: number[];
  spikerecorderId: number;
}

type TNodeData = {
  model: string;
  nodeId: number;
  nodeStatus: object;
  position: number[];
  recorderUnitId: number;
  simulationNodeId: number;
};

type TInsiteState = {
  activityGraphIntervalId: number;
  on: boolean;
  simulationTimeIntervalId: number;
  skip: number;
  spikesRequestTimeout: number;
  top: number;
};

export class Insite extends BaseObj {
  private _project: NESTProject;
  private _state: TInsiteState;

  constructor(project: NESTProject) {
    super();
    this._project = project;

    this._state = {
      activityGraphIntervalId: -1,
      on: false,
      simulationTimeIntervalId: -1,
      skip: 0,
      spikesRequestTimeout: 250,
      top: 2500,
    };
  }

  set activityGraphIntervalId(value: number) {
    clearInterval(this._state.activityGraphIntervalId);
    this._state.activityGraphIntervalId = value;
  }

  set simulationTimeIntervalId(value: number) {
    clearInterval(this._state.simulationTimeIntervalId);
    this._state.simulationTimeIntervalId = value;
  }

  get simulationRunningState(): boolean {
    return this._project.simulation.state.running;
  }

  get state(): TInsiteState {
    return this._state;
  }

  cancelAllIntervals(): void {
    this.simulationTimeIntervalId = -1;
    this.activityGraphIntervalId = -1;
    this._state.on = false;
  }

  /**
   * Update activity graph continuously.
   *
   * It calls `setInterval()` function.
   */
  continuouslyUpdateActivityGraph(milliseconds: number = 1000): void {
    this.activityGraphIntervalId = window.setInterval(() => {
      // Check if project has activities.
      this._project.activities.checkActivities();

      // Update activity graph.
      this._project.activityGraph.update();
    }, milliseconds);
  }

  /**
   * Update simulation time info continuously.
   *
   * It calls `setInterval()` function.
   */
  continuouslyUpdateSimulationTimeInfo(milliseconds: number = 250): void {
    this.logger.trace("Update simulation time info continuously");

    this.simulationTimeIntervalId = window.setInterval(() => {
      insiteAccess.getSimulationTimeInfo().then(
        (
          response: AxiosResponse<{
            begin: number;
            current: number;
            end: number;
            stepSize: number;
          }>,
        ) => {
          if (response === undefined) return;

          const timeInfo = response.data || {
            begin: 0,
            current: 0,
            end: 0,
            stepSize: 1,
          };

          if (timeInfo.current === this._project.simulation.state.timeInfo.current) return;

          this._project.simulation.state.timeInfo = timeInfo;

          // this._project.state.snackbar.text = `Getting activities from Insite regularly. Current time:
          //   ${this._project.simulation.state.timeInfo.current}ms.`;
        },
      );
    }, milliseconds);
  }

  /**
   * Get activities from Insite.
   *
   * First it checks if the simulation has started,
   * then it updates the activity graph frequently.
   * Afterwards it gets activities from Insite.
   */
  getActivities(): void {
    this._state.on = true;

    // const buttonProps = [
    //   {
    //     text: "terminate", // cancel, stop, end, kill, disconnect, unplug
    //     onClick: () => {
    //       this.cancelAllIntervals();
    //       // this._project.state.closeSnackbar();
    //     },
    //   },
    // ];

    // this._project.state.showSnackbar(
    //   "Getting activities from Insite regularly.",
    //   buttonProps,
    //   true
    // );

    // Get node Ids from Insite.
    this.getNodePositions().then((positions: Record<number, number[]> | undefined) => {
      // Check if project has activities.
      this._project.activities.checkActivities();

      // Get spike activities from Insite.
      if (this._project.activities.state.hasSomeSpikeRecorders) this.getSpikeActivities(positions);

      // Get analog signal activities from Insite.
      if (this._project.activities.state.hasSomeAnalogRecorders) this.getAnalogSignalActivities(positions);
    });
  }

  /**
   * Get IDs of all multimeters from Insite.
   *
   * @remarks
   * It initializes getting analog signal activities from Insite.
   *
   * @param positions object
   */
  getAnalogSignalActivities(positions: Record<number, number[]> | undefined): void {
    if (!this._state.on) return;
    this.logger.trace("Get analog signal activities from Insite");

    insiteAccess.getMultimeters().then((response: AxiosResponse<IInsiteMultimeterResponseData[]>) => {
      if (response == null) return;

      if (response.status === 202) {
        setTimeout(() => this.getAnalogSignalActivities(positions), 100);
        return;
      }

      const activities: IActivityProps[] = response.data.map((data: IInsiteMultimeterResponseData) => {
        const events: IEventProps = {
          times: [],
          senders: [],
        };
        data.attributes.forEach((attribute: string) => {
          events[attribute] = [];
        });

        const nodePositions: number[][] = [];
        if (positions) {
          if (Object.keys(positions).length > 0) {
            data.nodeIds.forEach((nodeId: number) => {
              if (nodeId in positions) nodePositions.push(positions[nodeId]);
            });
          }
        }

        return {
          events,
          recorderUnitId: data.multimeterId,
          nodeIds: data.nodeIds,
          nodePositions,
        };
      });

      // Sort activities by recorder unit IDs, as Insite does not provide a sorting at the moment. TODO: check in the future
      activities.sort((a: IActivityProps, b: IActivityProps) =>
        a.recorderUnitId && b.recorderUnitId ? a.recorderUnitId - b.recorderUnitId : 0,
      );

      // Initialize activities.
      this._project.activities.update(activities);

      // Get analog signal activities from each multimeter.
      this._project.activities.analogSignals.forEach((activity: AnalogSignalActivity) =>
        this.getAnalogSignalsFromRecorder(activity),
      );
    });
  }

  /**
   * Get activity from Insite.
   */
  getAnalogSignalsFromRecorder(activity: AnalogSignalActivity): void {
    if (!this._state.on) return;

    const attribute: string = "V_m";
    insiteAccess
      .getMultimeterAttribute(activity.recorderUnitId, attribute, {
        fromTime: activity.lastTime,
      })
      .then((response: AxiosResponse<{ nodeIds: number[]; simulationTimes: number[]; values: number[] }>) => {
        if (response == null) return;

        if (response.status === 202) {
          setTimeout(() => this.getAnalogSignalsFromRecorder(activity), 100);
          return;
        }

        const times: number[] = this.repeat(response.data);
        const senders: number[] = this.tile(response.data);
        const activityProps: IInsiteActivityProps = {
          events: {
            times, // x
            senders,
          },
          nodeIds: response.data.nodeIds, // from insite
          times: response.data.simulationTimes, // from insite
        };
        if (activityProps && activityProps.events) {
          activityProps.events[attribute] = response.data.values;
        }
        activity.update(activityProps);

        // Recursive call after 250ms.
        setTimeout(() => {
          this.getAnalogSignalsFromRecorder(activity);
        }, 250);
      });
  }

  /**
   * Get all first spike activity from Insite.
   */
  getAllFirstSpikeActivity(): void {
    if (!this._state.on) return;

    insiteAccess
      .getSpikes({ top: this._state.top, skip: this._state.skip })
      .then((response: AxiosResponse<{ nodeIds: number[]; simulationTimes: number[] }>) => {
        if (response == null) return;

        if (response.status === 202) {
          setTimeout(() => this.getAllFirstSpikeActivity(), 100);
          return;
        }

        const senders = response.data.nodeIds;
        const times = response.data.simulationTimes;

        this._state.spikesRequestTimeout =
          senders.length > 0
            ? 250
            : this._state.spikesRequestTimeout >= 5000
            ? 5000
            : this._state.spikesRequestTimeout + 250;

        if (senders == undefined || senders.length === 0) {
          setTimeout(() => this.getAllFirstSpikeActivity(), this._state.spikesRequestTimeout);
          return;
        }

        // Get spike activities from each spike recorder.
        this._project.activities.spikes.forEach((activity: NodeSpikeActivity) => {
          const events: Record<string, number[]> = {
            senders: [],
            times: [],
          };

          senders.forEach((senderId: number, idx: number) => {
            if (activity.nodeIds.includes(senderId)) {
              events.senders.push(senderId);
              events.times.push(times[idx]);
            }
          });

          activity.update({
            events,
          });
        });

        this._state.skip += Math.min(senders.length, this._state.top);

        // Recursive call after timeout.
        setTimeout(() => this.getAllFirstSpikeActivity(), 250);
      });
  }

  /**
   * Get all node IDs from Insite.
   *
   * @remarks
   * It gets node positions from Insite.
   */
  async getNodePositions(): Promise<Record<number, number[]> | undefined> {
    this.logger.trace("Get node IDs from Insite");

    return insiteAccess.getNodes().then((response: AxiosResponse<TNodeData[]>) => {
      if (response == null) return;
      const positions: Record<number, number[]> = {};

      response.data.forEach((data: TNodeData) => {
        if (data.position != null) {
          positions[data.nodeId] = data.position;
        }
      });

      return positions;
    });
  }

  /**
   * Get IDs of all spike recorders from Insite.
   *
   * @remarks
   * It initializes getting spike activities from Insite.
   *
   * @param positions Object
   */
  getSpikeActivities(positions?: { [key: number]: number[] }): void {
    if (!this._state.on) return;
    this.logger.trace("Get spike activities from Insite");

    insiteAccess.getSpikeRecorders().then((response: AxiosResponse<IInsiteSpikeRecorderResponseData[]>) => {
      if (response == null) return;

      if (response.status === 202) {
        setTimeout(() => this.getSpikeActivities(positions), 100);
        return;
      }

      const activities: IActivityProps[] = response.data.map((data: IInsiteSpikeRecorderResponseData) => {
        const nodePositions: number[][] = [];
        if (positions && Object.keys(positions).length > 0) {
          data.nodeIds.forEach((nodeId: number) => {
            if (nodeId in positions) {
              nodePositions.push(positions[nodeId]);
            }
          });
        }
        return {
          events: { senders: [], times: [] },
          recorderUnitId: data.spikerecorderId,
          nodeIds: data.nodeIds,
          nodePositions,
        };
      });

      // Sort activities by recorder unit IDs, as Insite does not provide a sorting at the moment.
      // TODO: check in the future
      activities.sort((a: IActivityProps, b: IActivityProps) =>
        a.recorderUnitId && b.recorderUnitId ? a.recorderUnitId - b.recorderUnitId : 0,
      );

      // Initialize activities.
      this._project.activities.update(activities);

      // Get spike activities for each spike recorder.
      // this._project.spikeActivities.forEach((activity: SpikeActivity) => {
      //   this.getSpikeActivityFromEachRecorder(activity);
      // });

      // Get spikes from Insite.
      this._state.skip = 0;
      this.getAllFirstSpikeActivity();
    });
  }

  /**
   * Get spikes for each recorder from Insite.
   */
  getSpikeActivityFromEachRecorder(activity: NodeSpikeActivity): void {
    if (!this._state.on) return;

    insiteAccess
      .getSpikes({
        fromTime: activity.lastTime + 0.1,
        spikedetectorId: activity.recorderUnitId,
      })
      .then(
        (
          response: AxiosResponse<{
            nodeIds: number[];
            simulationTimes: number[];
          }>,
        ) => {
          if (response == null) return;

          if (response.status === 202) {
            setTimeout(() => this.getSpikeActivityFromEachRecorder(activity), 100);
            return;
          }

          activity.update({
            events: {
              senders: response.data.nodeIds, // y
              times: response.data.simulationTimes, // x
            },
          });

          // Recursive call after 500ms.
          setTimeout(() => {
            this.getSpikeActivityFromEachRecorder(activity);
          }, 500);
        },
      );
  }

  repeat(data: { nodeIds: number[]; simulationTimes: number[] }): number[] {
    return data.simulationTimes.flatMap((e: number) => Array(data.nodeIds.length).fill(e));
  }

  /**
   * Notify whether the simulation is finished.
   */
  simulationEndNotification(): void {
    insiteAccess
      .getSimulationTimeInfo()
      .then((response: AxiosResponse<{ current: number; end: number; stepSize: number }>) => {
        const simulation = this._project.simulation;

        // Notify user when the simulation is finished.
        notifySuccess("Simulation is finished.");

        // Set interval to 2000 ms for simulation time info.
        // this.continuouslyUpdateSimulationTimeInfo(2000);

        // // // Set interval to 2000 ms for activity graph.
        // this.continuouslyUpdateActivityGraph(2000);

        // Check if the simulation is still running.
        simulation.state.running = response.data.end > response.data.current + response.data.stepSize;
      });
  }

  tile(data: { nodeIds: number[]; simulationTimes: number[] }): number[] {
    return data.simulationTimes.flatMap(() => data.nodeIds);
  }
}
