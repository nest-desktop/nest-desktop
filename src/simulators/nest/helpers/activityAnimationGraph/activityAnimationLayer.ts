// activityAnimationLayer.ts

import { GridHelper, Group, Object3DEventMap, Vector3 } from "three";
import { UnwrapRef, reactive } from "vue";

import { Activity, IEventProps } from "@/helpers/activity/activity";
import { NodeRecord } from "@/helpers/node/nodeRecord";
import { range } from "@/helpers/common/array";

import { ActivityAnimationGraph } from "./activityAnimationGraph";
import { ActivityAnimationLayerModel } from "./activityAnimationLayerModel";
import { BoxGeometryLayerModel } from "./activityAnimationLayerModels/boxGeometryLayerModel";
import { SphereGeometryLayerModel } from "./activityAnimationLayerModels/sphereGeometryLayerModel";

export interface IActivityAnimationLayerFrame {
  [key: string]: number[];
  senders: number[];
}

interface IActivityAnimationLayerModel {
  component: any;
  title: string;
  value: string;
}
export interface IActivityAnimationLayerState {
  layout: { extent: number[][] };
  modelSelected?: IActivityAnimationLayerModel;
  ndim: number;
  object: {
    flatHeight: boolean;
    flyingBoxes: boolean;
    opacity: number;
    size: number;
  };
  positions: Vector3[];
  record?: NodeRecord;
  records: NodeRecord[];
  reset: boolean;
  trail: { fading: boolean; length: number; mode: string };
  visible: boolean;
}

export class ActivityAnimationLayer {
  private _activity: Activity;
  private _frames: IActivityAnimationLayerFrame[] = [];
  private _graph: ActivityAnimationGraph;
  private _graphGroup?: Group<Object3DEventMap>;
  private _model?: ActivityAnimationLayerModel;
  private _models: IActivityAnimationLayerModel[] = [
    {
      component: BoxGeometryLayerModel,
      title: "box geometry",
      value: "BoxGeometryLayerModel",
    },
    {
      component: SphereGeometryLayerModel,
      title: "sphere geometry",
      value: "SphereGeometryLayerModel",
    },
  ];
  private _offset: Vector3 = new Vector3(0, 0, 0);
  private _state: UnwrapRef<IActivityAnimationLayerState> = reactive({
    layout: {
      extent: [
        [-1, 0],
        [-0.5, 0.5],
        [0.5, -0.5],
      ],
    },
    modelSelected: undefined,
    ndim: -1,
    object: {
      flatHeight: false,
      flyingBoxes: false,
      opacity: 1,
      size: 4,
    },
    positions: [] as Vector3[],
    record: undefined,
    records: [] as NodeRecord[],
    reset: false,
    trail: {
      fading: false,
      length: 0,
      mode: "off",
    },
    visible: true,
  });

  constructor(graph: ActivityAnimationGraph, activity: Activity) {
    this._graph = graph;
    this._activity = activity;
  }

  get activity(): Activity {
    return this._activity;
  }

  get bins(): number {
    return this._graph.state.grid.divisions;
  }

  get frame(): IActivityAnimationLayerFrame {
    return this.frames[this._graph.state.frameIdx] || {};
  }

  get frames(): IActivityAnimationLayerFrame[] {
    return this._frames;
  }

  get graph(): ActivityAnimationGraph {
    return this._graph;
  }

  get graphGroup(): Group<Object3DEventMap> | undefined {
    return this._graphGroup;
  }

  get model(): ActivityAnimationLayerModel | undefined {
    return this._model;
  }

  get modelSelected(): IActivityAnimationLayerModel | undefined {
    return this._state.modelSelected;
  }

  set modelSelected(value: IActivityAnimationLayerModel) {
    this._state.modelSelected = value;
    this.init();
    this._graph.updateScene();
  }

  get models(): IActivityAnimationLayerModel[] {
    return this._models;
  }

  get offset(): Vector3 {
    return this._offset;
  }

  /**
   * Get binned positions for histogram.
   */
  get positionsBinned(): { x: number; z: number }[] {
    const X: number[] = this.interval(-0.5, 0.5, this.bins);
    const Z: number[] = this.interval(-0.5, 0.5, this.bins);
    const positions: { x: number; z: number }[] = [];
    X.forEach((x: number) => {
      Z.forEach((z: number) => {
        positions.push({ x, z });
      });
    });
    return positions;
  }

  get state(): UnwrapRef<IActivityAnimationLayerState> {
    return this._state;
  }

  /**
   * Add empty frames.
   */
  addEmptyFrames(): void {
    this._frames = [];
    for (let i = 0; i < this._graph.state.nSamples; i++) {
      this._frames.push({ senders: [] });
    }
  }

  /**
   * Create grids.
   *
   * @remarks
   * returns a group of GridHelpers
   */
  createGrids(divisions: number = 2): Group<Object3DEventMap> {
    const grid: Group<Object3DEventMap> = new Group();
    const scale = new Vector3(1, 1, 1);

    if (this._state.ndim === 3) {
      const gridX: GridHelper = new GridHelper(1, divisions);
      gridX.geometry.rotateZ(Math.PI / 2);
      gridX.position.x = -scale.x / 2;
      grid.add(gridX);
    }

    const gridY: GridHelper = new GridHelper(1, divisions);
    gridY.position.y = this._state.ndim === 2 ? 0 : -scale.y / 2;
    grid.add(gridY);

    if (this._state.ndim === 3) {
      const gridZ: GridHelper = new GridHelper(1, divisions);
      gridZ.geometry.rotateX(Math.PI / 2);
      gridZ.position.z = -scale.z / 2;
      grid.add(gridZ);
    }
    return grid;
  }

  /**
   * Initialize layer for activity animation.
   */
  init(): void {
    if (this._activity.nodePositions.length > 0) {
      this._state.ndim = this._activity.nodePositions[0].length;
      this._state.positions = this._activity.nodePositions.map(
        (pos: number[]) =>
          new Vector3(
            pos[0],
            pos.length === 3 ? pos[1] : 0,
            pos.length === 3 ? pos[2] : pos[1]
          )
      );
    }

    this.initAnalogRecords();
    this.initFrames();
    this.initModel();
    this.initGraph();
  }

  /**
   * Initialize records from analog activities.
   */
  initAnalogRecords(): void {
    if (!this._activity.recorder.model.isAnalogRecorder) return;

    this._state.records = [] as NodeRecord[];
    if (this._activity.recorder.records == null) return;

    this._activity.recorder.records.forEach((record: NodeRecord) => {
      this._state.records.push(record as NodeRecord);
    });

    if (this._state.record == null) {
      const record = this._state.records.find(
        (record: { id: string }) => record.id === "V_m"
      );
      this._state.record = record != null ? record : this._state.records[0];
    }
  }

  /**
   * Initialize graph.
   */
  initGraph(): void {
    this._graphGroup = new Group();
    this._graphGroup.userData.layer = this;
    this._graphGroup.add(this.createGrids(this.bins));
    if (this._model) {
      this._graphGroup.add(this._model.graphGroup);
    }
  }

  /**
   * Initialize geometry model for activity layer.
   */
  initModel(): void {
    if (this._state.modelSelected == null) {
      this._state.modelSelected = this._models[1]; // sphere geometry
    }
    this._model = new this._state.modelSelected.component(this);
  }

  /**
   * Calculate interval for bins.
   */
  interval(min: number, max: number, size: number): number[] {
    const step: number = (max - min) / size / 2;
    const rangeData: number[] = range(min, max, step);
    return rangeData.filter((_: number, i: number) => i % 2 === 1);
  }

  /**
   * Initialize frames.
   */
  initFrames(): void {
    this.addEmptyFrames();
    this.updateFrames();
  }

  /**
   * Render frame of activity.
   */
  renderFrame(): void {
    if (this._model == undefined) return;

    if (this._state.visible) {
      this._model.render(this.frame);
    } else if (!this._state.reset) {
      this._model.resetObjects();
    }
  }

  /**
   * Update frames.
   *
   * @remarks
   * It requires activity events.
   */
  updateFrames(): void {
    const events: IEventProps = Object.assign({}, this._activity.events);
    if (events.senders == null) return;

    // Update records of analog signals.
    if (this._activity.recorder.model.isAnalogRecorder) {
      const records = this._state.records as NodeRecord[];
      records.forEach((record: NodeRecord) => record.update());
    }

    // Collect senders based on events.
    events.senders = events.senders.map((sender: number) =>
      this._activity.nodeIds.indexOf(sender)
    );

    // Add empty data (from individual recorder) in each frame.
    this._frames.forEach((frame: IActivityAnimationLayerFrame) => {
      Object.keys(events).forEach((eventKey: string) => {
        frame[eventKey] = [];
      });
    });

    // Push values in data frames.
    const sampleRate: number = this._graph.state.frames.sampleRate;
    events.times.forEach((time: number, idx: number) => {
      const frameIdx: number = Math.floor(time * sampleRate);
      const frame: IActivityAnimationLayerFrame = this._frames[frameIdx - 1];
      if (frame == null) return;

      Object.keys(events).forEach((eventKey: string) => {
        frame[eventKey].push(events[eventKey][idx]);
      });
      this._frames[frameIdx - 1] = frame;
    });
    console.log(this._frames.map((frame) => frame.times.length));
  }
}
