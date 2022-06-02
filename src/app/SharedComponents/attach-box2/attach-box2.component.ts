import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, Renderer2 } from '@angular/core';
import { Guid } from "guid-typescript";
import * as _ from 'lodash';

@Component({
  selector: 'app-attach-box2',
  templateUrl: './attach-box2.component.html',
  styleUrls: ['./attach-box2.component.scss']
})

export class AttachBox2Component implements OnInit {

  imageError: string = null;
  FormPdfbase64: string;
  NameValue : string = "";
  PdfSaved: boolean;
  uniqueId : Guid;
  id : string ;
  selectedfile : FileList;
  filename : string;
  id2: string;
  newunique : Guid; 

  @Input() attached2Heading: string;
  @Input() attached2Text: string;
  @Input() attached2Link: string;
  @Input() description : string;
  @Input() PDFName: string;
  AttachedPDFLink : string;
  @Output() CallParentFunction =  new EventEmitter<any>();
  @Output() CallAnotherFunction =  new EventEmitter<any>();

  @ViewChild('takeinput', {static: false}) InputVar: ElementRef;
  @ViewChild('viewlink', {static: false}) viewlink: ElementRef;

  constructor(
    public renderer : Renderer2,
  ) { }

  ngOnInit(): void {
    this.uniqueId = Guid.create();
    this.id = this.uniqueId.toString();

    this.newunique = Guid.create();
    this.id2 = this.newunique.toString();

  }

  openButtonLink(link)
  {
    window.open(link, '_blank');
  }

  viewButtonLink(link){
    debugger
    window.open(this.AttachedPDFLink, '_blank');
    //this.renderer.setAttribute(this.viewlink.nativeElement,'id',this.id);
  }

  CapturePDF(fileInput: any, Name) {
    debugger
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const max_size = 20971520;
      const allowed_types = ['application/pdf'];
      const max_height = 15200;
      const max_width = 25600;
      
      if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
        this.imageError = 'Please upload a valid PDF format.';
        return false;
      }
      debugger
      const reader = new FileReader();
      debugger
      reader.onload = (e: any) => {
        debugger
        this.selectedfile = fileInput.target.files;
        var url = URL.createObjectURL(this.selectedfile[0]);
        var array = e.target.result.split(',');
        if (array[0] == "data:application/pdf;base64") {
          this.FormPdfbase64 = array[1];
          debugger;
          this.PdfSaved = true;

          this.NameValue = Name;
          debugger
          var ARRAY : string[];
          ARRAY = [url,this.FormPdfbase64,Name];
          this.CallParentFunction.emit(ARRAY);
          this.AttachedPDFLink = ARRAY[0];
          // this.CallParentFunction.emit()
        }
        else {
          this.imageError = 'Please upload a valid PDF format.';
        }
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  removePdf(data){
    debugger
    this.InputVar.nativeElement.value = "";
    this.CallAnotherFunction.emit(data);
    this.FormPdfbase64 = null;
    this.PdfSaved = false;  
  }
}