import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CvComponent } from './cv/cv.component';
import { configCV } from './config/config-main';

import { HighlightModule, HighlightOptions } from 'ngx-highlightjs';
import { EyesComponent } from './eyes/eyes.component';
import { DrowEyeService } from './services/drow-eye.service';
import { NavbarComponent } from './navbar/navbar.component';

const options: HighlightOptions = {
  theme: configCV.theme
};
@NgModule({
  declarations: [
    AppComponent,
    CvComponent,
    EyesComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    HighlightModule.forRoot(options)
  ],
  providers: [DrowEyeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
