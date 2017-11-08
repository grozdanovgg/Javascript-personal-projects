import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CvComponent } from './cv/cv.component';

import { HighlightModule, HighlightOptions } from 'ngx-highlightjs';

// const options: HighlightOptions = {
//   theme: 'monokai-sublime'
// };
@NgModule({
  declarations: [
    AppComponent,
    CvComponent
  ],
  imports: [
    BrowserModule,
    HighlightModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
