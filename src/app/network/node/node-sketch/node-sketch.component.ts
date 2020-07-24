import { Component, OnInit, Input, ElementRef } from '@angular/core';

import * as d3 from 'd3';

import { NetworkConfigService } from '../../network-config/network-config.service';
import { NetworkSketchService } from '../../network-sketch/network-sketch.service';

import { Node } from '../../../components/node';


@Component({
  selector: 'g[app-node-sketch]',
  templateUrl: 'node-sketch.component.html',
  styleUrls: ['./node-sketch.component.scss'],
})
export class NodeSketchComponent implements OnInit {
  @Input() node: Node;
  @Input() dragable: boolean;
  @Input() eventTrigger: boolean = true;
  @Input() height: number;
  @Input() width: number;
  private selector: any;

  constructor(
    private _networkConfigService: NetworkConfigService,
    private _networkSketchService: NetworkSketchService,
    private elementRef: ElementRef,
  ) {
    this.selector = d3.select(elementRef.nativeElement);
  }

  ngOnInit() {
    if (this.node === undefined) return
    if (this.dragable) {
      const node = this.selector.selectAll("g.node").data([this.node]); // UPDATE
      node.on('mousedown.drag', null);
      node.call(this.dragHandler());
    }
  }

  radius(): number {
    const radius: number = this.node.config.data.graph.radius.value;
    return this.node.network.view.focusedNode === this.node ? radius + 3 : radius;
  }

  strokeWidth(): number {
    return this.node.config.data.graph.strokeWidth.value;
  }

  connect(sourceNode: Node): void {
    const connection: any = {
      source: sourceNode.idx,
      target: this.node.idx,
    }
    this.node.network.addConnection(connection);
  }

  onClick(event: MouseEvent): void {
    // console.log('Click node')
    const selectedNode: Node = this.node.network.view.selectedNode;
    if (this.eventTrigger && selectedNode && this.node.view.isFocused() && this._networkSketchService.connect) {
      this.connect(selectedNode);
      if (this._networkSketchService.keyDown == '17') return                     // STRG
      this.node.network.view.resetSelection();
      this._networkSketchService.reset();
    } else {
      this.node.network.view.selectedNode = this.node;
    }
    this._networkSketchService.connect = false;
  }

  dragHandler(): any {
    const r: number = this.node.config.data.graph.radius.value + 3;
    return d3.drag()
      .on('drag', (node: any) => {
        this.node.network.view.resetSelection();
        this.node.network.view.resetFocus();
        if (d3.event.x < r || d3.event.x > this.width - r - 1) return
        if (d3.event.y < r || d3.event.y > this.height - r - 1) return
        this.node.view.position.x = d3.event.x;
        this.node.view.position.y = d3.event.y;
      })
  }

}
