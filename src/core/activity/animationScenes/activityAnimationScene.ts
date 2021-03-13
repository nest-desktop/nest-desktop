import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'stats.js';
import { GUI } from 'dat.gui';

import { Activity } from '../activity';
import { ActivityAnimationGraph } from '../activityAnimationGraph';

export class ActivityAnimationScene {
  private _activityLayers: THREE.Group;
  private _animationFrameIdx: number;
  private _camera: THREE.PerspectiveCamera;
  private _clippingPlanes: THREE.Plane[] = [];
  private _clock: THREE.Clock;
  private _controls: OrbitControls;
  private _delta: number = 0;
  private _graph: ActivityAnimationGraph; // parent
  private _name: string;
  private _renderer: THREE.WebGLRenderer;
  private _scene: THREE.Scene;
  private _stats: Stats;
  private _useStats = false;

  constructor(name: string, graph: ActivityAnimationGraph) {
    this._name = name;
    this._graph = graph;

    this._animationFrameIdx = -1;
    this._camera = new THREE.PerspectiveCamera(5, 1, 1, 10000);
    this._renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._controls = new OrbitControls(this._camera, this._renderer.domElement);
    this._clock = new THREE.Clock();
    this._scene = new THREE.Scene();

    this._stats = new Stats();
    this._useStats = this._graph.project.app.config.devMode;

    this.init();
    this.update();
    this.animate();
  }

  get activityLayers(): THREE.Group {
    return this._activityLayers;
  }

  get aspect(): number {
    return this.graph.ref.clientWidth / this.graph.ref.clientHeight;
  }

  get config(): any {
    return this._graph.config;
  }

  get name(): string {
    return this._name;
  }

  get graph(): ActivityAnimationGraph {
    return this._graph;
  }

  get scene(): THREE.Scene {
    return this._scene;
  }

  /**
   * Initialize animation scene.
   */
  init(): void {
    // console.log('Init animation scene');
    this._scene.background = new THREE.Color(0xfefefe);

    this.setCameraPosition();
    this._scene.add(this._camera);
    this._scene.add(this.initAxesHelper());
    this._scene.add(this.initLights());
    this._scene.add(this.initPlaneHelpers());

    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(
      this.graph.ref.clientWidth,
      this.graph.ref.clientHeight
    );
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Append dom element in container.
    this.graph.ref.appendChild(this._renderer.domElement);

    // this._controls.rotateSpeed = 1;
    // this._controls.zoomSpeed = 1.2;
    // this._controls.enableKeys = false;

    if (this._useStats) {
      this._stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
      document.body.appendChild(this._stats.dom);
    }
  }

  /**
   * Create and return axes helper in init.
   */
  initAxesHelper(): THREE.AxesHelper {
    const axesHelper: THREE.AxesHelper = new THREE.AxesHelper(0.1);
    return axesHelper;
  }

  /**
   * Create and return lights group in init.
   */
  initLights(): THREE.Group {
    const lights: THREE.Group = new THREE.Group();
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 0.5).normalize();
    lights.add(light);
    lights.add(new THREE.AmbientLight(0x505050));
    return lights;
  }

  /**
   * Create and return plane helper in init.
   */
  initPlaneHelpers(): THREE.Group {
    this._clippingPlanes.push(new THREE.Plane(new THREE.Vector3(-1, 0, 0), 1));
    this._clippingPlanes.push(new THREE.Plane(new THREE.Vector3(0, -1, 0), 1));
    this._clippingPlanes.push(new THREE.Plane(new THREE.Vector3(0, 0, -1), 1));

    const helpers: THREE.Group = new THREE.Group();
    helpers.add(new THREE.PlaneHelper(this._clippingPlanes[0], 2, 0xff0000));
    helpers.add(new THREE.PlaneHelper(this._clippingPlanes[1], 2, 0x00ff00));
    helpers.add(new THREE.PlaneHelper(this._clippingPlanes[2], 2, 0x0000ff));
    helpers.visible = false;
    return helpers;
  }

  /**
   * Resize renderer with aspect in init.
   */
  resize(): void {
    this._camera.aspect = this.aspect;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(
      this.graph.ref.clientWidth,
      this.graph.ref.clientHeight
    );
    this._renderer.render(this._scene, this._camera);
  }

  /**
   * Update animation scene.
   */
  update(): void {
    this._scene.remove(this.activityLayers);

    const layersGraph: THREE.Group = new THREE.Group();
    const activities = this._graph.project.activities;
    this._graph.layers.forEach((layer: any, idx: number) => {
      const activity: Activity = activities[idx];
      if (layer.ndim !== -1) {
        const activityLayerGroup: THREE.Group = this.createLayerGroup(
          layer,
          activity
        );
        activityLayerGroup.userData = layer;
        layersGraph.add(activityLayerGroup);
        this._camera.layers.enable(activity.idx + 1);
      }
    });
    this._activityLayers = layersGraph;
    this._scene.add(this._activityLayers);
  }

  /**
   * Create layer group.
   */
  createLayerGroup(layer: any, activity: Activity): THREE.Group {
    const layerGraph: THREE.Group = new THREE.Group();
    layerGraph.add(this.grids());
    return layerGraph;
  }

  /**
   * Create and return grids.
   */
  grids(numDimensions: number = 2): THREE.Group {
    const grid: THREE.Group = new THREE.Group();
    const divisions = this.config.grid.divisions;
    const scale: any = { x: 1, y: 1, z: 1 };

    if (numDimensions === 3) {
      const gridX: THREE.GridHelper = new THREE.GridHelper(1, divisions);
      gridX.geometry.rotateZ(Math.PI / 2);
      gridX.position.x = -scale.x / 2;
      grid.add(gridX);
    }

    const gridY: THREE.GridHelper = new THREE.GridHelper(1, divisions);
    gridY.position.y = numDimensions === 2 ? 0 : -scale.y / 2;
    grid.add(gridY);

    if (numDimensions === 3) {
      const gridZ: THREE.GridHelper = new THREE.GridHelper(1, divisions);
      gridZ.geometry.rotateX(Math.PI / 2);
      gridZ.position.z = -scale.z / 2;
      grid.add(gridZ);
    }
    return grid;
  }

  /**
   * Animate scene.
   */
  animate(): void {
    // console.log('Start animation');
    this._animationFrameIdx = requestAnimationFrame(() => this.animate());

    // Cumulate interval for frame rate.
    this._delta += this._clock.getDelta();
    const interval: number = 1 / this._graph.config.frames.rate;

    // Render only in fixed frame rate or lower.
    if (this._delta > interval) {
      // Start time step for stats.
      if (this._stats) {
        this._stats.begin();
      }

      // Update camera.
      const camera: any = this._graph.config.camera;
      if (camera.control) {
        if (camera.rotation.speed > 0) {
          this.moveCamera();
        }
        this.setCameraPosition();
      }

      // Update frame idx.
      this.updateFrameIdx();

      // Render scene.
      this.render();
      this._renderer.render(this._scene, this._camera);

      // End time step for stats.
      if (this._stats) {
        this._stats.end();
      }

      // Modulo delta
      this._delta = this._delta % interval;
    }
  }

  updateFrameIdx(): void {
    const framesLength: number = this._graph.frames.length;
    const frames: any = this._graph.config.frames;
    const framesSpeed: number = frames.speed;
    this._graph.frameIdx =
      (this._graph.frameIdx + framesSpeed * frames.windowSize + framesLength) %
      framesLength;
  }

  /**
   * Render scene.
   */
  render(): void {
    if (this.graph.frame) {
      this.graph.frame.data.forEach((data: any, idx: number) => {
        // @ts-ignore
        const layerGroup: THREE.Group = this.activityLayers.children[idx];
        // @ts-ignore
        const activityLayerGroup: THREE.Group = layerGroup.children[1];
        activityLayerGroup.children.forEach((object: THREE.Mesh) => {
          // @ts-ignore
          object.material.opacity = 1;
        });
      });
    }
  }

  /**
   * Move camera in render.
   */
  moveCamera(): void {
    const camera: any = this.graph.config.camera;
    camera.rotation.theta += camera.rotation.speed;
    camera.rotation.theta = camera.rotation.theta % 360;
    const thetaRad: number = camera.rotation.theta * (Math.PI / 180);
    const position: any = this.graph.config.camera.position;
    position.x =
      camera.distance * Math.abs(Math.cos(thetaRad) + Math.cos(thetaRad * 4));
    position.z =
      camera.distance * Math.abs(Math.sin(thetaRad) + Math.sin(thetaRad * 4));
    this._camera.lookAt(this._scene.position);
  }

  /**
   * Update camera position in init and in render.
   */
  setCameraPosition(): void {
    const position: any = this.graph.config.camera.position;
    this._camera.position.set(position.x, position.y, position.z);
    this._camera.lookAt(this._scene.position);
  }

  /**
   * Destroy animation scene.
   */
  destroy() {
    this.stop();
    if (this.graph.ref.firstChild === this._renderer.domElement) {
      this.graph.ref.removeChild(this._renderer.domElement);
    }
    if (document.body.lastChild === this._stats.dom) {
      document.body.removeChild(this._stats.dom);
    }
    // https://stackoverflow.com/questions/21548247/clean-up-threejs-webgl-contexts
    this._renderer.forceContextLoss();
  }

  /**
   * Stop animation.
   */
  stop(): void {
    // console.log('Stop animation');
    cancelAnimationFrame(this._animationFrameIdx);
  }

  /**
   * Disable camera control.
   */
  disableCameraControl(): void {
    this.graph.config.camera.rotation.theta = 0;
    this.graph.config.camera.control = true;
  }

  /**
   * Enable camera control.
   */
  enableCameraControl(): void {
    this.graph.config.camera.control = false;
  }

  // TODO: @security Permitting direct access to the DOM can make your application more vulnerable to XSS attacks.
  // Carefully review any use of ElementRef in your code.
  // For more detail, see the Security Guide, https://angular.io/guide/security
  addGUI(ref: any) {
    // Init gui
    const gui = new GUI({ autoPlace: false, closed: false, closeOnTop: true });
    ref.nativeElement.appendChild(gui.domElement);
    const _this = this;

    // var sceneFolder = gui.addFolder('Scene');
    // sceneFolder.add(this.config.scene.fog, 'density', 0, 1, 0.001);
    // sceneFolder.add(this.config.scene.fog, 'near', 0, 100, 0.1);
    // sceneFolder.add(this.config.scene.fog, 'far', 0, 100, 0.1);

    const cameraProps = {
      get control() {
        return _this.config.camera.control;
      },
      set control(v) {
        _this.config.camera.control = v;
      },
      get 'rotation speed'() {
        return _this.config.camera.rotation.speed;
      },
      set 'rotation speed'(v) {
        _this.config.camera.rotation.speed = v;
      },
    };

    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(cameraProps, 'control');
    cameraFolder.add(this.config.camera, 'distance', 10, 20, 1);
    cameraFolder.add(cameraProps, 'rotation speed', 0, 3, 0.01);
    cameraFolder.add(this.config.camera.position, 'x', 0, 20, 0.1);
    cameraFolder.add(this.config.camera.position, 'y', 0, 20, 0.1);
    cameraFolder.add(this.config.camera.position, 'z', 0, 20, 0.1);

    // const layers: any = {
    //   'toggle grid': () => this._camera.layers.toggle(0),
    //   'enable all': () => this._camera.layers.enableAll(),
    //   'disable all': () => this._camera.layers.disableAll()
    // };
    // this._activityLayers.children.forEach((d, i) => {
    //   layers['toggle layer ' + (i + 1)] = () => this._camera.layers.toggle(i + 1);
    // });
    //
    // const layerFolder = gui.addFolder('Layer');
    //
    // const visLayerFolder = layerFolder.addFolder('Show');
    // this.data.map((d, i) => { visLayerFolder.add(layers, 'toggle layer ' + (i + 1)); });
    // visLayerFolder.add(layers, 'enable all');
    // visLayerFolder.add(layers, 'disable all');
    // //
    // const layerOffsetFolder = layerFolder.addFolder('Offset')
    // layerOffsetFolder.add(this.config.layer.offset, 'x', 0, 1.1, 0.1);
    // layerOffsetFolder.add(this.config.layer.offset, 'y', 0, 1.1, 0.1);
    // layerOffsetFolder.add(this.config.layer.offset, 'z', 0, 1.1, 0.1);
    //
    // const colormapFolder = layerFolder.addFolder('Colormap');
    // this.data.map((d, i) => { colormapFolder.add(this.config.layer.colormap, 'layer ' + (i + 1)); })

    // const dotsFolder = gui.addFolder('Dot marker');
    // dotsFolder.add(this.config.dots, 'size', 1, 20);
    // dotsFolder.add(this.config.dots, 'opacity');

    // const clippingProps: any = {
    // get 'enabled'() { return _this._renderer.localClippingEnabled; },
    // set 'enabled'(v) { _this._renderer.localClippingEnabled = v; },
    //   get 'x plane'() { return _this.clippingPlanes[0].constant; },
    //   set 'x plane'(v) { _this.clippingPlanes[0].constant = v; },
    //   get 'y plane'() { return _this.clippingPlanes[1].constant; },
    //   set 'y plane'(v) { _this.clippingPlanes[1].constant = v; },
    //   get 'z plane'() { return _this.clippingPlanes[2].constant; },
    //   set 'z plane'(v) { _this.clippingPlanes[2].constant = v; },
    // };

    // const clippingFolder = gui.addFolder('Clipping');
    // clippingFolder.add(clippingProps, 'Enabled');
    // clippingFolder.add(clippingProps, 'x plane', -.5, .5, 0.01);
    // clippingFolder.add(clippingProps, 'y plane', -.5, .5, 0.01);
    // clippingFolder.add(clippingProps, 'z plane', -.5, .5, 0.01);
  }
}
