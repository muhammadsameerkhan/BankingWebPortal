import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { ProgressBarCircleComponent } from './progress-bar-circle/progress-bar-circle.component';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { AttachBoxComponent } from './attach-box/attach-box.component';
import { CircleIconComponent } from './circle-icon/circle-icon.component';
import { CustomSelectComponent } from './custom-select/custom-select.component';
import { AttachBox2Component } from './attach-box2/attach-box2.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../assets/i18n/', '.json');
};

@NgModule({
  declarations: [HeaderComponent, ProgressBarCircleComponent, AttachBoxComponent, CircleIconComponent, CustomSelectComponent, AttachBox2Component],
  imports: [
    CommonModule,
    HttpClientModule,
    RoundProgressModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  exports: [HeaderComponent, ProgressBarCircleComponent, AttachBoxComponent, CircleIconComponent, CustomSelectComponent, AttachBox2Component]
})
export class SharedComponentModule { }
