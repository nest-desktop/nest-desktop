import { Component, OnInit, Input } from '@angular/core';

import { FormatService } from '../../../services/format/format.service';

import { Node } from '../../../components/node';

import { listAnimation } from '../../../animations/list-animation';


@Component({
  selector: 'app-node-list',
  templateUrl: './node-list.component.html',
  styleUrls: ['./node-list.component.scss'],
  animations: [
    listAnimation
  ]
})
export class NodeListComponent implements OnInit {
  @Input() node: Node;
  @Input() selective: boolean = false;

  constructor(
    public _formatService: FormatService,
  ) {
  }

  ngOnInit() {
  }

}
