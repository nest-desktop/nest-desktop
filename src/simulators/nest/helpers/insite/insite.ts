// insite.ts

import { openToast } from "@/helpers/common/toast";
import { logger as mainLogger } from "@/helpers/common/logger";
import { AnalogSignalActivity } from "@/helpers/activity/analogSignalActivity";
import { SpikeActivity } from "@/helpers/activity/spikeActivity";

import { NESTProject } from "../project/project";
import { useInsiteAccessStore } from "../../store/backends/insiteAccessStore";

const logger = mainLogger.getSubLogger({ name: "insite" });

type activityType = {
  events: any;
  nodeIds: number[];
  nodePositions: number[][];
  recorderUnitId: number;
};

type nodeDataType = {
  model: string;
  nodeId: number;
  nodeStatus: Object;
  position: Object | null;
  recorderUnitId: number;
  simulationNodeId: number;
};

type stateType = {
  activityGraphIntervalId: number;
  on: boolean;
  simulationTimeIntervalId: number;
  skip: number;
  spikesRequestTimeout: number;
  top: number;
};

export class Insite {
  private _project: NESTProject;
  private _state: stateType;

  constructor(project: NESTProject) {
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

  get insiteAccess(): any {
    const insiteAccessStore = useInsiteAccessStore();
    return insiteAccessStore;
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

  get state(): stateType {
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
    logger.trace("Update simulation time info continuously");

    this.simulationTimeIntervalId = window.setInterval(() => {
      this.insiteAccess.instance
        .get("nest/simulationTimeInfo/")
        .then((response: any) => {
          if (response === undefined) return;

          const timeInfo = response.data || {
            begin: 0,
            current: 0,
            end: 0,
            stepSize: 1,
          };

          if (
            timeInfo.current === this._project.simulation.state.timeInfo.current
          ) {
            return;
          }

          this._project.simulation.state.timeInfo = timeInfo;

          this._project.state.snackbar.text = `Getting activities from Insite regularly. Current time:
            ${this._project.simulation.state.timeInfo.current}ms.`;
        });
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

    const buttonProps = [
      {
        text: "terminate", // cancel, stop, end, kill, disconnect, unplug
        onClick: () => {
          this.cancelAllIntervals();
          this._project.state.closeSnackbar();
        },
      },
    ];

    this._project.state.showSnackbar(
      "Getting activities from Insite regularly.",
      buttonProps,
      true
    );

    // Get node Ids from Insite.
    this.getNodePositions().then((positions: any) => {
      // Check if project has activities.
      this._project.activities.checkActivities();

      // Get spike activities from Insite.
      if (this._project.activities.state.hasSomeSpikeRecorders) {
        this.getSpikeActivities(positions);
      }

      // Get analog signal activities from Insite.
      if (this._project.activities.state.hasSomeAnalogRecorders) {
        this.getAnalogSignalActivities(positions);
      }
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
  getAnalogSignalActivities(positions: any): void {
    if (!this._state.on) {
      return;
    }
    logger.trace("Get analog signal activities from Insite");

    this.insiteAccess.instance
      .get("nest/multimeters/")
      .then((response: any) => {
        if (response == null) {
          return;
        }

        if (response.status === 202) {
          setTimeout(() => this.getAnalogSignalActivities(positions), 100);
          return;
        }

        const activities: activityType[] = response.data.map((data: any) => {
          const events: any = { times: [], senders: [] };
          data.attributes.forEach((attribute: string) => {
            events[attribute] = [];
          });

          const nodePositions: number[][] = [];
          if (Object.keys(positions).length > 0) {
            data.nodeIds.forEach((nodeId: number) => {
              if (nodeId in positions) {
                nodePositions.push(positions[nodeId]);
              }
            });
          }

          return {
            events,
            recorderUnitId: data.multimeterId,
            nodeIds: data.nodeIds,
            nodePositions,
          };
        });

        // Sort activities by recorder unit IDs, as Insite does not provide a sorting at the moment. TODO: check in the future
        activities.sort(
          (a: any, b: any) => a.recorderUnitId - b.recorderUnitId
        );

        // Initialize activities.
        this._project.activities.update(activities);

        // Get analog signal activities from each multimeter.
        this._project.activities.analogSignals.forEach(
          (activity: AnalogSignalActivity) =>
            this.getAnalogSignalsFromRecorder(activity)
        );
      });
  }

  /**
   * Get activity from Insite.
   */
  getAnalogSignalsFromRecorder(activity: AnalogSignalActivity): void {
    if (!this._state.on) {
      return;
    }

    const attribute: string = "V_m";
    const path = `nest/multimeters/${activity.recorderUnitId}/attributes/${attribute}/?fromTime=${activity.lastTime}`;
    this.insiteAccess.instance.get(path).then((response: any) => {
      if (response == null) {
        return;
      }

      if (response.status === 202) {
        setTimeout(() => this.getAnalogSignalsFromRecorder(activity), 100);
        return;
      }

      const times: number[] = this.repeat(response.data);
      const senders: number[] = this.tile(response.data);
      const activityData: any = {
        events: {
          times, // x
          senders,
        },
        nodeIds: response.data.nodeIds, // from insite
        times: response.data.simulationTimes, // from insite
      };
      activityData.events[attribute] = response.data.values;
      activity.update(activityData);

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
    if (!this._state.on) {
      return;
    }
    const path = `nest/spikes/?top=${this._state.top}&skip=${this._state.skip}`;
    this.insiteAccess.instance.get(path).then((response: any) => {
      if (response == null) {
        return;
      }

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
        setTimeout(
          () => this.getAllFirstSpikeActivity(),
          this._state.spikesRequestTimeout
        );
        return;
      }

      // Get spike activities from each spike recorder.
      this._project.activities.spikes.forEach((activity: SpikeActivity) => {
        const events: { [key: string]: number[] } = {
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
  async getNodePositions(): Promise<any> {
    if (!this._state.on) {
      return;
    }
    logger.trace("Get node IDs from Insite");

    const positions: any = {};
    return this.insiteAccess.instance
      .get("nest/nodes/")
      .then((response: any) => {
        if (response == null) {
          return;
        }

        response.data.forEach((data: nodeDataType) => {
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
  getSpikeActivities(positions: any | null): void {
    if (!this._state.on) {
      return;
    }
    logger.trace("Get spike activities from Insite");

    this.insiteAccess.instance
      .get("nest/spikerecorders/")
      .then((response: any) => {
        if (response == null) {
          return;
        }

        if (response.status === 202) {
          setTimeout(() => this.getSpikeActivities(positions), 100);
          return;
        }

        const activities: activityType[] = response.data.map((data: any) => {
          const nodePositions: number[][] = [];
          if (Object.keys(positions).length > 0) {
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

        // Sort activities by recorder unit IDs, as Insite does not provide a sorting at the moment. TODO: check in the future
        activities.sort(
          (a: any, b: any) => a.recorderUnitId - b.recorderUnitId
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
  getSpikeActivityFromEachRecorder(activity: SpikeActivity): void {
    if (!this._state.on) {
      return;
    }

    const path = `nest/spikes/?fromTime=${
      activity.lastTime + 0.1
    }&spikedetectorId=${activity.recorderUnitId}`;
    this.insiteAccess.instance.get(path).then((response: any) => {
      if (response == null) {
        return;
      }

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
    });
  }

  repeat(data: any): number[] {
    return data.simulationTimes.flatMap((e: number) =>
      Array(data.nodeIds.length).fill(e)
    );
  }

  /**
   * Notify whether the simulation is finished.
   */
  simulationEndNotification(): void {
    this.insiteAccess.instance
      .get("nest/simulationTimeInfo/")
      .then((response: any) => {
        const simulation = this._project.simulation;

        // Notify user when the simulation is finished.
        openToast("Simulation is finished.", { type: "success" });

        // Set interval to 2000 ms for simulation time info.
        // this.continuouslyUpdateSimulationTimeInfo(2000);

        // // // Set interval to 2000 ms for activity graph.
        // this.continuouslyUpdateActivityGraph(2000);

        // Check if the simulation is still running.
        simulation.state.running =
          response.data.end > response.data.current + response.data.stepSize;
      });
  }

  tile(data: any): number[] {
    return data.simulationTimes.flatMap(() => data.nodeIds);
  }
}
