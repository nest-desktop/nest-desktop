import * as THREE from 'three';

import { ActivityAnimationGraph } from '../activityAnimationGraph';
import { ActivityAnimationScene } from './activityAnimationScene';


export class ActivityScatterTimeAnimationScene extends ActivityAnimationScene {

  constructor(graph: ActivityAnimationGraph, containerId: string) {
    super('timeSphere', graph, containerId);
  }

  renderFrame(): void {
    if (this.graph.frame) {
      this.graph.frame.data.forEach((data: any) => this.renderScatter(data));
      this.renderTrail();
    }
  }

  renderScatter(data: any, options: any = {}): void {
    if (data === undefined) { return; }

    const extent: number[][] = this.graph.layout.extent || [
      [-0.5, 0.5],
      [-0.5, 0.5],
    ];
    const ndim: number = extent.length;
    const geometry: THREE.SphereGeometry = new THREE.SphereGeometry(0.01);

    const opacity: number = options.hasOwnProperty('opacity') ? options.opacity : data.opacity || 1;
    const scale: number = this.graph.config.objectSize * (options.scale || 1);
    const layerOffset: any = this.graph.config.layer.offset;

    const configFrames: any = this.graph.config.frames;
    const trail: any = this.graph.config.trail;
    const ts: number = this.graph.frameIdx / configFrames.sampleRate;

    for (let i = 0; i < data.x.length; i++) {
      const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
        color: this.graph.colorRGB(data.color[i]),
        transparent: true,
        opacity,
      });
      const object: THREE.Mesh = new THREE.Mesh(
        geometry,
        material
      );

      let x: number;
      if (trail.mode === 'temporal') {
        x = (data.time - data.times[i]) / configFrames.windowSize;
      } else {
        x = data.x[i] + layerOffset.x * data.idx;
      }
      object.position.x = x;
      object.position.y = data.y[i] + layerOffset.y * data.idx;
      if (ndim > 2) {
        object.position.z = data.z[i] + layerOffset.z * data.idx;
      }
      if (scale !== 1) {
        object.scale.x = scale;
        object.scale.y = scale;
        object.scale.z = scale;
      }
      this.scene.add(object);
    }
  }

  renderTrail(): void {
    const trail: any = this.graph.config.trail;
    if (trail.mode === 'off') { return; }

    let ratio: number;
    let scale: number;
    let opacity: number;
    for (let trailIdx = 0; trailIdx < trail.length; trailIdx++) {
      const frame: any = this.graph.frames[this.graph.frameIdx - trailIdx];
      if (frame) {
        ratio = trailIdx / (trail.length + 1);
        opacity = 1 - (trail.fading ? ratio : 0);
        switch (trail.mode) {
          case 'growing':
            scale = 1 + ratio;
            break;
          case 'shrinking':
            scale = 1 - ratio;
            break;
          default:
            scale = 1;
        }
        frame.data.forEach((data: any) =>
          this.renderScatter(data, {
            opacity,
            scale,
          })
        );
      }
    }
  }

}
