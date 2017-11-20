import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  innerHeight: any;
  innerWidth: any;
  constructor() {
    this.innerHeight = ((window.screen.height) - 16) + 'px';
    this.innerWidth = ((window.screen.width) - 16) + 'px';
  }
}
