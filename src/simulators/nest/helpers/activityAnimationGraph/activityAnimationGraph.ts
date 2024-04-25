// activityAnimationGraph.ts

import { Group } from "three";

import { Activity } from "../../../../helpers/activity/activity";
import { ActivityAnimationLayer } from "./activityAnimationLayer";
import { ActivityAnimationScene } from "./activityAnimationScene";
import { BaseProject } from "../../../../helpers/project/project";
import { TProject } from "@/types/projectTypes";

interface IActivityAnimationGraphConfig {
  frames: {
    rate: number;
    sampleRate: number;
    speed: number;
    windowSize: number;
  };
  grid: {
    divisions: number;
  };
}

interface IActivityAnimationGraphState {
  frameIdx: number;
  nSamples: number;
}

export interface IPosition {
  x: number;
  y: number;
  z: number;
}

export class ActivityAnimationGraph {
  private _config: IActivityAnimationGraphConfig = {
    frames: {
      rate: 24,
      sampleRate: 1,
      speed: 1,
      windowSize: 1,
    },
    grid: {
      divisions: 10,
    },
  };

  private _layers: ActivityAnimationLayer[] = [];
  private _project: TProject;
  private _scene?: ActivityAnimationScene;
  private _state: IActivityAnimationGraphState = {
    frameIdx: 0,
    nSamples: 0,
  };

  constructor(project: TProject) {
    this._project = project;
  }

  get config(): IActivityAnimationGraphConfig {
    return this._config;
  }

  get layers(): ActivityAnimationLayer[] {
    return this._layers;
  }

  get project(): BaseProject {
    return this._project as BaseProject;
  }

  get scene(): ActivityAnimationScene | undefined {
    return this._scene;
  }

  get state(): IActivityAnimationGraphState {
    return this._state;
  }

  /**
   * Add layer groups to the parent group.
   */
  addLayersToGroup(group: Group<any>): void {
    this._layers.forEach((layer: ActivityAnimationLayer) => {
      if (layer.graphGroup) {
        group.add(layer.graphGroup);
      }
    });
  }

  /**
   * Decrease frame speed by 1.
   */
  decrementFrameSpeed(): void {
    this._config.frames.speed -= 1;
  }

  /**
   * Destroy animation scene.
   */
  destroyScene(): void {
    if (!this._scene) return;

    this._scene.destroy();
  }

  /**
   * Increase frame speed by 1.
   */
  incrementFrameSpeed(): void {
    this._config.frames.speed += 1;
  }

  /**
   * Initialize activity graph for animation.
   *
   * @remarks
   * It runs without checking activities.
   */
  init(): void {
    this._layers = [];
  }

  /**
   * Initialize animation scene.
   *
   * @remarks
   * It should be initialized in the vue component is mounted.
   */
  initScene(ref: any): void {
    this.destroyScene();
    this._scene = new ActivityAnimationScene(this, ref);
    this.updateScene();
  }

  /**
   * Pause frame animation.
   */
  pauseFrameAnimation(): void {
    this._config.frames.speed = 0;
  }

  /**
   * Play frame animation backward.
   */
  playBackwardFrameAnimation(): void {
    this._config.frames.speed = -1;
  }

  /**
   * Play frame animation.
   */
  playFrameAnimation(): void {
    this._config.frames.speed = 1;
  }

  /**
   * Render frames of activity layers.
   */
  renderFrameLayers(): void {
    this._layers.forEach((layer: ActivityAnimationLayer) => {
      layer.renderFrame();
    });
  }

  /**
   * Move one frame forward in the animation.
   */
  stepForwardFrame(): void {
    this.pauseFrameAnimation();
    this._state.frameIdx = (this._state.frameIdx + 1) % this._state.nSamples;
  }

  /**
   * Go back one frame in the animation.
   */
  stepBackwardFrame(): void {
    this.pauseFrameAnimation();
    this._state.frameIdx =
      (this._state.frameIdx - 1 + this._state.nSamples) % this._state.nSamples;
  }

  /**
   * Update activity graph for animation.
   *
   * @remarks
   * It requires network activities.
   */
  update(): void {
    this._state.nSamples =
      this.project.simulation.state.biologicalTime *
      this._config.frames.sampleRate;

    // Update activity layers and frames.
    this.project.activities.all.forEach((activity: Activity) => {
      const layer = new ActivityAnimationLayer(this, activity);
      let position = activity.idx;
      if (this._layers[position] == null) {
        position = this._layers.push(layer) - 1;
      } else if (layer.activity !== activity) {
        this._layers[position] = layer;
      }
      this._layers[position].init();
    });
    this.updateScene();
  }

  /**
   * Update frame of activity layers.
   */
  updateFrame(): void {
    this.updateFrameIdx();
    this.renderFrameLayers();
  }

  /**
   * Update frame index.
   */
  updateFrameIdx(): void {
    const frames: {
      rate: number;
      sampleRate: number;
      speed: number;
      windowSize: number;
    } = this._config.frames;

    if (this._state.nSamples === 0 || Number.isNaN(this.state.frameIdx)) {
      this.state.frameIdx = 0;
    } else {
      this._state.frameIdx =
        (this._state.frameIdx +
          frames.speed * frames.windowSize +
          this._state.nSamples) %
        this._state.nSamples;
    }
  }

  /**
   * Update animation scene.
   */
  updateScene(): void {
    if (!this._scene) return;

    this._scene.update();

    // Enable camera for all layers.
    this._layers.forEach((layer: ActivityAnimationLayer) => {
      if (!this._scene) return;

      this._scene.camera.layers.enable(layer.activity.idx + 1);
    });
  }
}
