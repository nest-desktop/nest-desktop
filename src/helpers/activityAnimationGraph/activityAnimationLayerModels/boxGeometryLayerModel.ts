// boxGeometryLayerModel.ts

import { BoxGeometry, Mesh, MeshLambertMaterial } from "three";

import { ActivityAnimationLayer } from "../activityAnimationLayer";
import { ActivityAnimationLayerModel } from "../activityAnimationLayerModel";
import { IPosition } from "../activityAnimationGraph";

export class BoxGeometryLayerModel extends ActivityAnimationLayerModel {
  constructor(layer: ActivityAnimationLayer) {
    super(layer);
  }

  /**
   * Add graph for box geometry model.
   */
  override addGraph(): void {
    const scale = 0.01;
    const geometry: BoxGeometry = new BoxGeometry(scale, scale, scale);

    this.layer.state.positions.forEach((position: IPosition) => {
      const material: MeshLambertMaterial = new MeshLambertMaterial({
        color: this.layer.activity.recorder.view.color,
        transparent: true,
      });
      const mesh: Mesh<any, MeshLambertMaterial, any> = new Mesh(
        geometry,
        material
      );
      mesh.userData.position = position;
      mesh.position.set(position.x, position.y, position.z);
      mesh.scale.set(scale, scale, scale);
      mesh.layers.set(this.layer.activity.idx + 1);

      if (this.graphGroup) {
        this.graphGroup.add(mesh);
      }
    });
  }

  /**
   * Update mesh object.
   */
  override updateMesh(
    mesh: Mesh<any, MeshLambertMaterial, any>,
    options: any = {}
  ): void {
    mesh.material.color.set(options.color);
    mesh.material.opacity = options.opacity;
    mesh.scale.set(options.scale, options.scale, options.scale);
    mesh.position.setY(mesh.userData.position.y);
    if (this.layer.config.object.flatHeight) {
      mesh.scale.setY(0.5);
      if (this.layer.config.object.flyingBoxes) {
        mesh.position.setY(options.height * 0.01);
      }
    } else {
      if (this.layer.activity.recorder.model.isAnalogRecorder) {
        mesh.scale.setY(options.height);
      }
      mesh.position.setY(mesh.userData.position.y + options.height / 200);
    }
  }
}
