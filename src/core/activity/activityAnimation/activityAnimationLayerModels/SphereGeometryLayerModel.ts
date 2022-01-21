import * as THREE from 'three';

import { ActivityAnimationLayer } from '../activityAnimationLayer';
import { ActivityAnimationLayerModel } from '../activityAnimationLayerModel';

export class SphereGeometryLayerModel extends ActivityAnimationLayerModel {
  constructor(layer: ActivityAnimationLayer) {
    super(layer);
  }

  /**
   * Add graph for sphere geometry model.
   */
  override addGraph(): void {
    const scale = 0.01;
    const geometry: THREE.SphereGeometry = new THREE.SphereGeometry(scale / 2);

    this.layer.state.positions.forEach((position: any) => {
      const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
        color: this.layer.activity.recorder.view.color,
        transparent: true,
      });
      const mesh: THREE.Mesh = new THREE.Mesh(geometry, material);

      mesh.userData.position = position;
      mesh.position.set(position.x, position.y, position.z);
      mesh.scale.set(scale, scale, scale);
      mesh.layers.set(this.layer.activity.idx + 1);

      this.graphGroup.add(mesh);
    });
  }
}
