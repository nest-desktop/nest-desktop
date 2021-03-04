import * as d3 from 'd3';

import { Activity } from './activity';
import { ActivityAnimationSceneBox } from './animationScenes/activityAnimationSceneBox';
import { ActivityAnimationSceneBoxHistogram } from './animationScenes/activityAnimationSceneBoxHistogram';
import { ActivityAnimationSceneSphere } from './animationScenes/activityAnimationSceneSphere';
import { Project } from '../project/project';

export class ActivityAnimationGraph {
  private _config: any;
  private _frameIdx = 0;
  private _frames: any[] = [];
  private _layers: any[] = [];
  private _layout: any = {};
  private _project: Project;
  private _recordables: string[] = [];
  private _recordablesOptions: any[] = [];
  private _recordFrom = 'V_m';
  private _ref: any;
  private _scene: any;
  private _sceneIdx: number = 0;
  private _scenes: any[] = [];
  private _style: any = {};

  constructor(project: Project) {
    this._project = project;
    this._config = {
      camera: {
        position: {
          x: 16,
          y: 8,
          z: 8,
        },
        distance: 12,
        rotation: {
          theta: 0,
          speed: 0,
        },
        control: false,
      },
      layer: {
        offset: {
          x: 0,
          y: 0,
          z: 0,
        },
      },
      colorMap: {
        min: -70,
        max: -55,
        reverse: false,
        scale: 'Spectral',
      },
      frames: {
        sampleRate: 1,
        speed: 1,
        rate: 24,
        windowSize: 1,
      },
      trail: {
        mode: 'off',
        length: 0,
        fading: false,
      },
      grid: {
        divisions: 10,
      },
      objectSize: 4,
      opacity: 1,
      flatHeight: false,
      flyingBoxes: false,
    };

    this._layout = {
      extent: [
        [-1, 0],
        [-0.5, 0.5],
        [0.5, -0.5],
      ],
    };

    this._scenes = [
      {
        idx: 0,
        label: 'Sphere',
        scene: () => new ActivityAnimationSceneSphere(this),
      },
      {
        idx: 1,
        label: 'Box',
        scene: () => new ActivityAnimationSceneBox(this),
      },
      {
        idx: 2,
        label: 'Box Histogram',
        scene: () => new ActivityAnimationSceneBoxHistogram(this),
      },
    ];
    this.init();
  }

  get config(): any {
    return this._config;
  }

  get endtime(): number {
    return this._project.simulation.time;
  }

  get frame(): any {
    return this.frames[this._frameIdx] || { data: [] };
  }

  get frameIdx(): number {
    return this._frameIdx;
  }

  set frameIdx(value: number) {
    this._frameIdx = value;
  }

  get frames(): any[] {
    return this._frames;
  }

  get layers(): any[] {
    return this._layers;
  }

  get layout(): any {
    return this._layout;
  }

  get project(): Project {
    return this._project;
  }

  get ref(): any {
    return this._ref;
  }

  get recordables(): string[] {
    return this._recordables;
  }

  get recordablesOptions(): any[] {
    return this._recordablesOptions;
  }

  get recordFrom(): string {
    return this._recordFrom;
  }

  set recordFrom(value: string) {
    this._recordFrom = value;
  }

  get sceneIdx(): number {
    return this._sceneIdx;
  }

  set sceneIdx(idx: number) {
    this._sceneIdx = idx;
    this.initScene();
  }

  get scene(): any {
    return this._scene;
  }

  get scenes(): any[] {
    return this._scenes;
  }

  get style(): any {
    return this._style;
  }

  /**
   * Normalize value for color or height.
   */
  normalize(value: number): number {
    const min: number = this._config.colorMap.min;
    const max: number = this._config.colorMap.max;
    return (value - min) / (max - min);
  }

  /**
   * RGB color for a value in range [0 - 1].
   */
  colorRGB(value: number): string {
    const colorScale: any = d3['interpolate' + this._config.colorMap.scale];
    return colorScale(this._config.colorMap.reverse ? 1 - value : value);
  }

  /**
   * Initialize activity graph for animation.
   *
   * @remarks
   * It runs without checking activities.
   */
  init(): void {
    // console.log('Init activity animation');
    this._layers = [];
    this._recordables = [];
    this._recordablesOptions = [];
    this._recordFrom = 'V_m';
    this._frames = this.createEmptyFrames();
  }

  /**
   * Initialize animation scene.
   */
  initScene(ref: any = undefined): void {
    if (this._scene) {
      this._scene.destroy();
    }
    if (ref) {
      this._ref = ref;
    }
    setTimeout(() => {
      this._scene = this._scenes[this._sceneIdx].scene();
    }, 1);
  }

  /**
   * Initialize frames for animation.
   *
   * @remarks
   * It requires simulation time.
   */
  createEmptyFrames(): any[] {
    // Add empty frames if not existed
    const sampleRate: number = this._config.frames.sampleRate;
    const nframes: number = this.endtime * sampleRate;
    const frames: any[] = [];
    for (let i = 0; i < nframes; i++) {
      frames.push({
        frameIdx: i,
        data: [],
      });
    }
    return frames;
  }

  /**
   * Update activity graph for animation.
   *
   * @remarks
   * It requires network activities.
   */
  update(): void {
    // console.log('Update activity animation graph');
    this.init();
    this.project.activities.forEach((activity: Activity) => {
      this.updateLayers(activity);
      this.updateFrames(activity);
    });
    this._recordablesOptions = this._recordables.map((recordable: string) => ({
      value: recordable,
    }));
  }

  /**
   * Update layers for a population.
   */
  updateLayers(activity: Activity): void {
    const layer: any = {
      activityIdx: activity.idx,
      color: activity.recorder.view.color,
      ndim: -1,
      positions: [],
    };
    if (activity.nodePositions.length > 0) {
      layer.ndim = activity.nodePositions[0].length;
      layer.positions = activity.nodePositions.map((pos: number[]) => ({
        x: pos[0],
        y: pos.length === 3 ? pos[1] : 0,
        z: pos.length === 3 ? pos[2] : pos[1],
      }));
    }
    this._layers.push(layer);
  }

  /**
   * Update frames for a population.
   */
  updateFrames(activity: Activity): void {
    const events: any = JSON.parse(JSON.stringify(activity.events));
    if (events.senders === undefined) {
      return;
    }
    events.senders = events.senders.map((sender: number) =>
      activity.nodeIds.indexOf(sender)
    );
    const eventKeys: string[] = Object.keys(events);
    eventKeys.forEach((eventKey: string) => {
      if (
        !this._recordables.includes(eventKey) &&
        !['senders', 'times'].includes(eventKey)
      ) {
        this._recordables.push(eventKey);
      }
    });

    // Add empty data (from individual recorder) in each frame
    this._frames.forEach((frame: any) => {
      const data: any = {};
      eventKeys.forEach((eventKey: string) => {
        data[eventKey] = [];
      });
      data.activityIdx = activity.idx;
      frame.data.push(data);
      frame.data[frame.data.length - 1].idx = frame.data.length - 1;
    });

    // Push values in data frames
    const sampleRate: number = this._config.frames.sampleRate;
    events.times.forEach((time: number, idx: number) => {
      const frameIdx: number = Math.floor(time * sampleRate);
      const frame: any = this._frames[frameIdx - 1];
      if (frame === undefined) {
        return;
      }
      const data: any = frame.data[activity.idx];
      eventKeys.forEach((eventKey: string) => {
        data[eventKey].push(events[eventKey][idx]);
      });
    });
  }

  /**
   * Increase frame speed by 1.
   */
  increment(): void {
    this.config.frames.speed += 1;
  }

  /**
   * Decrease frame speed by 1.
   */
  decrement(): void {
    this.config.frames.speed -= 1;
  }

  /**
   * Stop frame animation.
   */
  stop(): void {
    this.config.frames.speed = 0;
  }

  /**
   * Play frame animation.
   */
  play(): void {
    this.config.frames.speed = 1;
  }

  /**
   * Play frame animation backward.
   */
  playBackward(): void {
    this.config.frames.speed = -1;
  }

  /**
   * Move one frame forward in the animation.
   */
  step(): void {
    this.stop();
    const framesLength: number = this._frames.length;
    this._frameIdx = (this._frameIdx + 1) % framesLength;
  }

  /**
   * Go back one frame in the animation.
   */
  stepBackward(): void {
    this.stop();
    const framesLength: number = this._frames.length;
    this._frameIdx = (this._frameIdx - 1 + framesLength) % framesLength;
  }
}
