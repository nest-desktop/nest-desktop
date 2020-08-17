import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Connection } from '../../../components/connection/connection';

import { FormatService } from '../../../services/format/format.service';


@Component({
  selector: 'app-connection-list',
  templateUrl: './connection-list.component.html',
  styleUrls: ['./connection-list.component.scss']
})
export class ConnectionListComponent implements OnInit {
  @Input() connection: Connection;
  @Input() selective: boolean = false;

  constructor(
    public formatService: FormatService,
  ) { }

  ngOnInit() {
  }

  synWeights(): any {
    if (!this.connection.projections.hasOwnProperty('weights')) {
      return this.formatService.format(1);
    }
    if (!this.connection.projections.weights.hasOwnProperty('parametertype')) {
      return this.formatService.format(this.connection.projections.weights);
    }
    if (this.connection.projections.weights.parametertype == 'constant') {
      return this.formatService.format(this.connection.projections.weights.specs.value);
    }
    return this.connection.projections.weights.parametertype;
  }

  synDelays(): any {
    if (!this.connection.projections.hasOwnProperty('delays')) {
      return this.formatService.format(1);
    }
    if (!this.connection.projections.delays.hasOwnProperty('parametertype')) {
      return this.formatService.format(this.connection.projections.delays);
    }
    if (this.connection.projections.delays.parametertype == 'constant') {
      return this.formatService.format(this.connection.projections.delays.specs.value);
    }
    return this.connection.projections.delays.parametertype;
  }

}
