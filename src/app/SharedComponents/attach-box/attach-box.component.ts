import { Component,Input,OnInit,Output,EventEmitter,ViewChild,ElementRef, TemplateRef, Renderer2} from '@angular/core';
import * as _ from 'lodash';
import { Guid } from "guid-typescript";


@Component({
  selector: 'app-attach-box',
  templateUrl: './attach-box.component.html',
  styleUrls: ['./attach-box.component.scss']
})
export class AttachBoxComponent implements OnInit {

  imageError: string = null;
  isImageSaved: boolean;
  cardImageBase64: string;
  image64: string[];
  imagebase64: string;
  identity1: number;
  uniqueId : Guid;
  id : string ;
  imagesrc;

  @Input() attachedHeading: string;
  @Output() callParentFunction =  new EventEmitter<any>();
  @Output() callAnotherFunction =  new EventEmitter<any>();
  @Input() attachedText: string = "UploadJPEG";
  @ViewChild("modal") Modal: ElementRef;
  @ViewChild("imageid") imagetag : ElementRef;
  @ViewChild('takeinput', {static: false}) InputVar: ElementRef;

  constructor(
    public renderer: Renderer2,
  ) { }
  
  ngOnInit(): void {
    this.uniqueId = Guid.create();
    this.id = this.uniqueId.toString();
  }

  fileChangeEvent(fileInput: any) {
    debugger
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const max_size = 5000000;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 2229;
      const max_width = 8386;

      if (fileInput.target.files[0].size > max_size) {
        this.imageError =
          'You have exceeded 5 MB. Please upload a valid format page.';

        return false;
      }

      if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
        this.imageError = 'Please upload a valid JPEG, PNG or JPG format. Max size: 5 MB';
        return false;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        debugger
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];

          console.log(img_height, img_width);

          if (img_height > max_height && img_width > max_width) {
            this.imageError =
              'Maximum dimentions allowed ' +
              max_height +
              '*' +
              max_width +
              'px';
            return false;
          } else {
            const imgBase64Path = e.target.result;
            this.cardImageBase64 = imgBase64Path;
            this.image64 = this.cardImageBase64.split(',');
            this.imagebase64 = this.image64[1];

            this.renderer.setAttribute(this.imagetag.nativeElement,'src',this.image64[0] + ',' + this.image64[1]);

            this.isImageSaved =  true;
            this.callParentFunction.emit(this.imagebase64);
          }
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }
  
  removeImage() {
    this.InputVar.nativeElement.value = "";
    this.cardImageBase64 = null;
    this.isImageSaved = false;
    this.callAnotherFunction.emit();
    this.renderer.removeClass(this.Modal.nativeElement, "active");
  }

  hidePopup() {
    this.renderer.removeClass(this.Modal.nativeElement, "active");
  }

  showPopup() {
    this.renderer.addClass(this.Modal.nativeElement, "active");
  }
}
