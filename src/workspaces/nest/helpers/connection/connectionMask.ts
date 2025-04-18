// connectionMask.ts

import { BaseObj } from "@/helpers/common/base";

import { NESTConnection } from "./connection";

enum EMaskType {
  circular = "circular",
  doughnut = "doughnut",
  elliptical = "elliptical",
  none = "none",
  rectangular = "rectangular",
}

export interface INESTConnectionMaskProps {
  masktype?: EMaskType;
  specs: any;
}

export class NESTConnectionMask extends BaseObj {
  private _connection: NESTConnection;
  private _graph: any;
  private _masktype: EMaskType;
  private _specs: any;

  constructor(connection: NESTConnection, maskProps?: INESTConnectionMaskProps) {
    super({
      config: { name: "NESTConnectionMask", simulator: "nest" },
    });

    this._connection = connection;
    this._graph = {
      data: [],
      layout: {
        xaxis: { range: [-0.55, 0.55] },
        yaxis: { range: [-0.55, 0.55] },
      },
      style: { position: "relative", width: "100%", height: "100%" },
    };
    this._masktype = maskProps?.masktype || EMaskType.none;
    this._specs = maskProps?.specs || {};
  }

  get connection(): NESTConnection {
    return this._connection;
  }

  get graph(): any {
    return this._graph;
  }

  get hasMask(): boolean {
    return this._masktype !== "none";
  }

  get list(): string[] {
    return Object.keys(this.config?.localStorage);
  }

  get masktype(): EMaskType {
    return this._masktype;
  }

  get specs(): any {
    return this._specs;
  }

  /**
   * Draw mask.
   */
  draw(): void {
    this._graph.layout.shapes = [];
    if (this._masktype == undefined) return;

    switch (this._masktype) {
      case "rectangular":
        this.drawRect();
        break;
      case "circular":
        this.drawCircle();
        break;
      case "doughnut":
        this.drawDoughnut();
        break;
      case "elliptical":
        this.drawEllipsis();
        break;
    }
  }

  /**
   * Draw circle.
   */
  drawCircle(): void {
    this._graph.layout.shapes = [
      {
        type: "circle",
        xref: "x",
        yref: "y",
        x0: -1 * this._specs.radius,
        y0: -1 * this._specs.radius,
        x1: this._specs.radius,
        y1: this._specs.radius,
        opacity: 0.2,
        fillcolor: "blue",
        line: {
          color: "blue",
        },
      },
    ];
  }

  /**
   * Draw doughnut.
   */
  drawDoughnut(): void {
    this._graph.layout.shapes = [
      {
        type: "circle",
        xref: "x",
        yref: "y",
        x0: -1 * this._specs.outer_radius,
        y0: -1 * this._specs.outer_radius,
        x1: this._specs.outer_radius,
        y1: this._specs.outer_radius,
        opacity: 0.2,
        fillcolor: "blue",
        line: {
          color: "blue",
        },
      },
      {
        type: "circle",
        xref: "x",
        yref: "y",
        x0: -1 * this._specs.inner_radius,
        y0: -1 * this._specs.inner_radius,
        x1: this._specs.inner_radius,
        y1: this._specs.inner_radius,
        opacity: 1,
        fillcolor: "white",
        line: {
          color: "white",
        },
        // }, {
        //   type: 'line',
        //   xref: 'x',
        //   yref: 'y',
        //   x0: -1 * specs.inner_radius,
        //   y0: 0,
        //   x1: specs.inner_radius,
        //   y1: 0,
        //   line: {
        //     width: 1,
        //     color: 'black',
        //   }
        // }, {
        //   type: 'line',
        //   xref: 'x',
        //   yref: 'y',
        //   x0: 0,
        //   y0: -1 * specs.inner_radius,
        //   x1: 0,
        //   y1: specs.inner_radius,
        //   line: {
        //     width: 1,
        //     color: 'black',
        //   }
      },
    ];
  }

  /**
   * Draw ellipsis.
   */
  drawEllipsis(): void {
    this._graph.layout.shapes = [
      {
        type: "circle",
        xref: "x",
        yref: "y",
        x0: (-1 * this._specs.major_axis) / 2,
        y0: (-1 * this._specs.minor_axis) / 2,
        x1: this._specs.major_axis / 2,
        y1: this._specs.minor_axis / 2,
        opacity: 0.2,
        fillcolor: "blue",
        line: {
          color: "blue",
        },
      },
    ];
  }

  /**
   * Draw rectangle.
   */
  drawRect(): void {
    this._graph.layout.shapes = [
      {
        type: "rect",
        xref: "x",
        yref: "y",
        x0: this._specs.lower_left[0],
        y0: this._specs.lower_left[1],
        x1: this._specs.upper_right[0],
        y1: this._specs.upper_right[1],
        opacity: 0.2,
        fillcolor: "blue",
        line: {
          color: "blue",
        },
      },
    ];
  }

  /**
   * Select a mask type.
   * @param value mask type
   */
  select(value: EMaskType): void {
    if (value === "none") {
      this.unmask();
    } else {
      this._masktype = value;
      this._specs = {};
      this.config?.localStorage.data[value].specs.forEach((spec: { id: string; value: any }) => {
        this._specs[spec.id] = spec.value;
      });
    }
    this.draw();
  }

  /**
   * Serialize for JSON.
   * @return connection mask props
   */
  toJSON(): INESTConnectionMaskProps {
    const maskProps: any = {
      masktype: this._masktype,
      specs: this._specs,
    };
    return maskProps;
  }

  /**
   * Unmask.
   */
  unmask(): void {
    this._masktype = EMaskType.none;
  }
}
