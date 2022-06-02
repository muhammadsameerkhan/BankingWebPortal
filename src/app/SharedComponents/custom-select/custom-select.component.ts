import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss']
})
export class CustomSelectComponent implements OnInit {

  selectedValue
  selectValues
  status: boolean = false;

  constructor() { 
    this.selectedValue = "";

    this.selectValues = [
      {selectValueItem:'Value 1'}, 
      {selectValueItem:'Value 2'},
      {selectValueItem:'Value 3'}
    ];
  }

  showSelectDrop() {
    this.status = !this.status;
  }

  selectListValue(e) {
    this.selectedValue = e;
    this.showSelectDrop();
  }

  ngOnInit(): void {
  }

}
