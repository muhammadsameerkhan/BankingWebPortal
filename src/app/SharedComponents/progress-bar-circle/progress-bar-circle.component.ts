import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar-circle',
  templateUrl: './progress-bar-circle.component.html',
  styleUrls: ['./progress-bar-circle.component.scss']
})
export class ProgressBarCircleComponent implements OnInit {

  @Input() counter: string;
  @Input() current: string;
  @Input() max: string;

  constructor() {
    // this.current = 1;
    // this.max = 4;
  }

  ngOnInit(): void {
  }

}
