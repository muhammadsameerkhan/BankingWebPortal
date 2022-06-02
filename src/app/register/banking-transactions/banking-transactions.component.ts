import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-banking-transactions',
  templateUrl: './banking-transactions.component.html',
  styleUrls: ['./banking-transactions.component.scss']
})
export class BankingTransactionsComponent implements OnInit {

  counter: string;
  current: string;
  max: string;

  constructor(public translate : TranslateService) { 
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit(): void {
    this.counter = "3";
    this.current = "11";
    this.max = "13";
  }

}
