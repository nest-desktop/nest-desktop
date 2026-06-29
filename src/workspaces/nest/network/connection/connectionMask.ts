// connectionMask.ts

import { BaseObj, type IBaseState } from "@/core";

import type { NESTConnection } from "./connection";

enum EMaskType {
  circular = "circular",
  doughnut = "doughnut",
  elliptical = "elliptical",
  none = "none",
  rectangular = "rectangular",
}

interface IShape {
  type: string;
  xref: string;
  yref: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  opacity: number;
  fillcolor: string;
  line: {
    color: string;
  };
}

interface IGraph {
  data: number[];
  layout: {
    xaxis: { range: [number, number] };
    yaxis: { range: [number, number] };
    shapes?: IShape[];
  };
  style: { position: string; width: string; height: string };
}

interface ISpecs {
  inner_radius?: number;
  lower_left?: [number, number];
  major_axis?: number;
  minor_axis?: number;
  outer_radius?: number;
  radius?: number;
  upper_right?: [number, number];
}

export interface INESTConnectionMaskState extends IBaseState {
  masktype?: EMaskType;
  specs: ISpecs;
}

export class NESTConnectionMask extends BaseObj {
  private _connection: NESTConnection;
  private _graph: IGraph;
  private _masktype: EMaskType = EMaskType.none;
  private _specs: ISpecs = {};

  constructor(connection: NESTConnection) {
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
  }

  get connection(): NESTConnection {
    return this._connection;
  }

  get graph(): IGraph {
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

  get specs(): ISpecs {
    return this._specs;
  }

  /**
   * Draw mask.
   */
  draw(): void {
    this.graph.layout.shapes = [];
    if (this.masktype == undefined) return;

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
        x0: -1 * this.specs.radius,
        y0: -1 * this.specs.radius,
        x1: this.specs.radius,
        y1: this.specs.radius,
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
        x0: -1 * this.specs.outer_radius,
        y0: -1 * this.specs.outer_radius,
        x1: this.specs.outer_radius,
        y1: this.specs.outer_radius,
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
        x0: -1 * this.specs.inner_radius,
        y0: -1 * this.specs.inner_radius,
        x1: this.specs.inner_radius,
        y1: this.specs.inner_radius,
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
        x0: (-1 * this.specs.major_axis) / 2,
        y0: (-1 * this.specs.minor_axis) / 2,
        x1: this.specs.major_axis / 2,
        y1: this.specs.minor_axis / 2,
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
        x0: this.specs.lower_left[0],
        y0: this.specs.lower_left[1],
        x1: this.specs.upper_right[0],
        y1: this.specs.upper_right[1],
        opacity: 0.2,
        fillcolor: "blue",
        line: {
          color: "blue",
        },
      },
    ];
  }

  /**
   * Save connection mask to state.
   * @return connection mask state
   */
  override save(): INESTConnectionMaskState {
    const maskState: INESTConnectionMaskState = {
      masktype: this._masktype,
      specs: this._specs,
    };
    return maskState;
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
      this._specs = {} as ISpecs;
      this.config?.localStorage.data[value].specs.forEach((spec: { id: string; value: number | number[] }) => {
        this.specs[spec.id] = spec.value;
      });
    }
    this.draw();
  }

  /**
   * Unmask.
   */
  unmask(): void {
    this._masktype = EMaskType.none;
  }
}
