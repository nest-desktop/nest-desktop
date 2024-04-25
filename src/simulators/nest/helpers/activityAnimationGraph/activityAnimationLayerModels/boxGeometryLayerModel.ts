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
    options: {
      color?: string;
      height?: number;
      opacity?: number;
      scale?: number;
    } = {}
  ): void {
    this.logger.trace("update mesh");
    const color = options.color || "0x000000";
    const height = options.height || 1;
    const opacity = options.opacity || 1;
    const scale = options.scale || 0.01;
    const position = mesh.userData.position.y;

    mesh.material.color.set(color);
    mesh.material.opacity = opacity;
    mesh.scale.set(scale, scale, scale);
    mesh.position.setY(position.y);

    if (this.layer.config.object.flatHeight) {
      mesh.scale.setY(0.5);
      if (this.layer.config.object.flyingBoxes) {
        mesh.position.setY(height * 0.01);
      }
    } else {
      if (this.layer.activity.recorder.model.isAnalogRecorder) {
        mesh.scale.setY(height);
      }
      mesh.position.setY(mesh.userData.position.y + height / 200);
    }
  }
}
