import { AnalogSignalActivity } from '../../activity/analogSignalActivity';
import { Backend } from '../../common/backend';
import { consoleLog } from '../../common/logger';
import { Project } from '../project';
import { SpikeActivity } from '../../activity/spikeActivity';

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
  fromTime: number;
  intervalId: number | null;
  on: boolean;
};

export class Insite {
  private _project: Project;
  private _state: stateType;

  constructor(project: Project) {
    this._project = project;

    this._state = {
      fromTime: 0,
      intervalId: null,
      on: false,
    };
  }

  get state(): stateType {
    return this._state;
  }

  get insiteAccess(): Backend {
    return this._project.app.backends.insiteAccess;
  }

  cancelGettingActivity(): void {
    this._state.on = false;
  }

  consoleLog(text: string): void {
    consoleLog(this, text, 5);
  }

  /**
   * Get activities from Insite.
   *
   * First it checks if the simulation has started,
   * then it updates the activity graph frequently.
   * Afterwards it gets activities from Insite.
   */
  getActivities(): void {
    this.consoleLog('Get activites from Insite');
    this._state.fromTime = 0;
    this._state.on = true;

    const buttonProps = [
      {
        text: 'Cancel',
        onClick: () => {
          this.cancelGettingActivity();
          this._project.state.closeSnackbar();
        },
      },
    ];

    this._project.state.showSnackbar(
      'The network is initialized. Getting activities from Insite regularly.',
      buttonProps,
      true
    );

    this.getSimulationTimeInfo();
  }

  /**
   * Get simulation time info from Insite.
   */
  getSimulationTimeInfo(): void {
    if (!this.state.on) {
      return;
    }
    this.consoleLog('Get simulation time info from Insite');

    this.insiteAccess.instance
      .get('nest/simulationTimeInfo/')
      .catch(() => {
        setTimeout(() => this.getSimulationTimeInfo(), 100);
      })
      .then((response: any) => {
        if (response == null) {
          return;
        }
        this._project.simulation.state.timeInfo = response.data;

        // Update activity graph during the simulation.
        this.continuouslyUpdateActivityGraph();

        this.getNodesIds();
      });
  }

  /**
   * Update activity graph continuously.
   *
   * It calls `setInterval()` function.
   */
  continuouslyUpdateActivityGraph(): void {
    this.consoleLog('Update activity graph continuously');

    this.state.intervalId = window.setInterval(() => {
      // Check if project has activities.
      this._project.state.checkActivities();

      // Update activity graph.
      this._project.activityGraph.update();

      if (!this.state.on) {
        clearInterval(this.state.intervalId);
      }
    }, 1000);
  }

  /**
   * Get all node IDs from Insite.
   *
   * @remarks
   * It gets node positions from Insite.
   */
  getNodesIds(): void {
    if (!this.state.on) {
      return;
    }
    this.consoleLog('Get node IDs from Insite');

    const positions: any = {};
    this.insiteAccess.instance.get('nest/nodes/').then((response: any) => {
      response.data.forEach((data: nodeDataType) => {
        if (data.position != null) {
          positions[data.nodeId] = data.position;
        }
      });

      // Check if project has activities.
      this._project.state.checkActivities();

      if (this._project.state.activities.hasSomeSpikeRecorders) {
        this.getSpikeActivities(positions);
      }

      if (this._project.state.activities.hasSomeAnalogRecorders) {
        this.getAnalogSignalActivities(positions);
      }
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
    if (!this.state.on) {
      return;
    }
    this.consoleLog('Get spike activities from Insite');

    this.insiteAccess.instance
      .get('nest/spikerecorders/')
      .then((response: any) => {
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

        // Sort activities by recorder unit IDs, as Insite does not provide a sorting at the moment.
        activities.sort(
          (a: any, b: any) => a.recorderUnitId - b.recorderUnitId
        );

        // Initialize activities.
        this._project.initActivities(activities);

        // Get spike activities from each spike recorder.
        this._project.spikeActivities.forEach((activity: SpikeActivity) =>
          activity.getActivityInsite()
        );
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
    if (!this.state.on) {
      return;
    }
    this.consoleLog('Get analog signal activities from Insite');

    this.insiteAccess.instance
      .get('nest/multimeters/')
      .then((response: any) => {
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
        this._project.initActivities(activities);

        // Get analog signal activities from each multimeter.
        this._project.analogSignalActivities.forEach(
          (activity: AnalogSignalActivity) => activity.getActivityInsite()
        );
      });
  }
}
