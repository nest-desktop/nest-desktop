// activityAnimationScene.ts

import Stats from "stats.js";
import {
  AmbientLight,
  AxesHelper,
  Clock,
  Color,
  DirectionalLight,
  Group,
  Object3DEventMap,
  PerspectiveCamera,
  Plane,
  PlaneHelper,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { UnwrapRef, reactive } from "vue";

import { darkMode } from "@/helpers/common/theme";
import { useAppStore } from "@/stores/appStore";

import { ActivityAnimationGraph } from "./activityAnimationGraph";

interface ICameraState {
  control: boolean;
  distance: number;
  position: Vector3;
  rotation: {
    speed: number;
    theta: number;
  };
}

interface IActivityAnimationSceneState {
  camera: ICameraState;
}

export class ActivityAnimationScene {
  private _animationFrameId: number;
  private _camera: PerspectiveCamera;
  private _clippingPlanes: Plane[] = [];
  private _clock: Clock;
  private _controls: OrbitControls;
  private _delta: number = 0;
  private _graph: ActivityAnimationGraph; // parent
  private _layerGraphGroup?: Group<Object3DEventMap>;
  private _ref: any;
  private _renderer: WebGLRenderer;
  private _scene: Scene;
  private _state: UnwrapRef<IActivityAnimationSceneState>;
  private _stats: Stats;
  private _useStats = false;

  constructor(graph: ActivityAnimationGraph, ref: any) {
    this._graph = graph;
    this._ref = ref;

    this._state = reactive<IActivityAnimationSceneState>({
      camera: {
        control: false,
        distance: 12,
        rotation: {
          theta: 0,
          speed: 0,
        },
        position: new Vector3(16, 8, 8),
      },
    });

    this._animationFrameId = -1;
    this._camera = new PerspectiveCamera(5, 1, 1, 10000);
    this._renderer = new WebGLRenderer({
      antialias: true,
    });
    this._controls = new OrbitControls(this._camera, this._renderer.domElement);
    this._clock = new Clock();
    this._scene = new Scene();
    this.updateSceneBackground();

    this._stats = new Stats();

    const appStore = useAppStore();
    this._useStats = appStore.state.devMode;

    this.init();
  }

  get camera(): PerspectiveCamera {
    return this._camera;
  }

  get controls(): OrbitControls {
    return this._controls;
  }

  get layerGraphGroup(): Group<Object3DEventMap> | undefined {
    return this._layerGraphGroup;
  }

  get state(): IActivityAnimationSceneState {
    return this._state;
  }

  /**
   * Animate scene.
   */
  animate(): void {
    this._animationFrameId = requestAnimationFrame(() => this.animate());

    // Cumulate interval for frame rate.
    this._delta += this._clock.getDelta();
    const interval: number = 1 / this._graph.state.frames.rate;

    // Render only in fixed frame rate or lower.
    if (this._delta <= interval) return;

    // Start time step for stats.
    if (this._stats) this._stats.begin();

    // Update camera.
    const camera: ICameraState = this._state.camera;
    if (camera.control) {
      if (camera.rotation.speed > 0) this.moveCamera();
      this.setCameraPosition();
    }

    if (this._graph.state.frames.speed !== 0) {
      // Update frame of the activity graph.
      this._graph.updateFrame();
    }

    // Render scene.
    this.render();

    // End time step for stats.
    if (this._stats) this._stats.end();

    // Modulo delta.
    this._delta = this._delta % interval;
  }

  /**
   * Create and return lights group in init.
   */
  createLights(): Group<Object3DEventMap> {
    const lightGroup: Group<Object3DEventMap> = new Group();

    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 0.5).normalize();
    lightGroup.add(directionalLight);

    const ambientLight = new AmbientLight(0x505050);
    lightGroup.add(ambientLight);

    return lightGroup;
  }

  /**
   * Create and return plane helper in init.
   */
  createPlaneHelpers(): Group<Object3DEventMap> {
    this._clippingPlanes.push(new Plane(new Vector3(-1, 0, 0), 1));
    this._clippingPlanes.push(new Plane(new Vector3(0, -1, 0), 1));
    this._clippingPlanes.push(new Plane(new Vector3(0, 0, -1), 1));

    const helpers: Group<Object3DEventMap> = new Group();
    helpers.add(new PlaneHelper(this._clippingPlanes[0], 2, 0xff0000));
    helpers.add(new PlaneHelper(this._clippingPlanes[1], 2, 0x00ff00));
    helpers.add(new PlaneHelper(this._clippingPlanes[2], 2, 0x0000ff));
    helpers.visible = false;
    return helpers;
  }

  /**
   * Destroy animation scene.
   */
  destroy(): void {
    cancelAnimationFrame(this._animationFrameId);

    if (this._ref.firstChild === this._renderer.domElement) this._ref.removeChild(this._renderer.domElement);
    if (document.body.lastChild === this._stats.dom) document.body.removeChild(this._stats.dom);

    // https://stackoverflow.com/questions/21548247/clean-up-threejs-webgl-contexts
    // TODO: It shows message in the debug:
    // WebGL context was lost. three.module.js:23546
    // THREE.WebGLRenderer: Context Lost.
    this._renderer.forceContextLoss();
  }

  /**
   * Disable camera control.
   */
  disableCameraControl(): void {
    this._state.camera.rotation.theta = 0;
    this._state.camera.control = true;
  }

  /**
   * Enable camera control.
   */
  enableCameraControl(): void {
    this._state.camera.control = false;
  }

  /**
   * Initialize animation scene.
   */
  init(): void {
    this.setCameraPosition();
    this._scene.add(this._camera);
    this._scene.add(new AxesHelper(0.1));
    this._scene.add(this.createLights());
    this._scene.add(this.createPlaneHelpers());

    this._renderer.setPixelRatio(window.devicePixelRatio);
    this.resize();
    window.addEventListener("resize", () => this.resize());

    // Append dom element in container.
    this._ref.appendChild(this._renderer.domElement);

    // this._state.camera.rotation.speed = 1;
    // this._state.camera.control = false;

    if (this._useStats) {
      this._stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
      document.body.appendChild(this._stats.dom);
    }

    this.update();
    this.animate();
  }

  /**
   * Move camera in render.
   */
  moveCamera(): void {
    const camera: ICameraState = this._state.camera;
    camera.rotation.theta += camera.rotation.speed;
    camera.rotation.theta = camera.rotation.theta % 360;
    const thetaRad: number = camera.rotation.theta * (Math.PI / 180);
    const position: Vector3 = this._state.camera.position;
    position.x = camera.distance * Math.abs(Math.cos(thetaRad) + Math.cos(thetaRad * 4));
    position.z = camera.distance * Math.abs(Math.sin(thetaRad) + Math.sin(thetaRad * 4));
    this._camera.lookAt(this._scene.position);
  }

  /**
   * Render scene and camera.
   */
  render(): void {
    this._renderer.render(this._scene, this._camera);
  }

  /**
   * Resize renderer with aspect in init.
   */
  resize(): void {
    this._camera.aspect = this._ref.clientWidth / this._ref.clientHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(this._ref.clientWidth, this._ref.clientHeight);

    this.render();
  }

  /**
   * Update camera position in init and in render.
   */
  setCameraPosition(): void {
    const position: Vector3 = this._state.camera.position;
    this._camera.position.set(position.x, position.y, position.z);
    this._camera.lookAt(this._scene.position);
  }

  /**
   * Update animation scene.
   */
  update(): void {
    this.updateSceneBackground();
    if (this._layerGraphGroup) {
      this._scene.remove(this._layerGraphGroup);
    }
    this._layerGraphGroup = new Group();
    this._graph.addLayersToGroup(this._layerGraphGroup);
    this._scene.add(this._layerGraphGroup);
  }

  /**
   * Update scene background.
   */
  updateSceneBackground(): void {
    this._scene.background = darkMode() ? new Color(0x121212) : new Color(0xfefefe);
  }
}
