import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-foreign-information',
  templateUrl: './foreign-information.component.html',
  styleUrls: ['./foreign-information.component.scss']
})
export class ForeignInformationComponent implements OnInit {

  counter: string;
  current: string;
  max: string;

  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit(): void {
    this.counter = "2";
    this.current = "7";
    this.max = "13";
  }

}
