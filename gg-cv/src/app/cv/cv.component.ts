import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css']
})
export class CvComponent implements OnInit {
  protected customText: string;

  protected someCode =
  `class Developer implements IHuman {
    private test;
  }`;

  constructor() {
  }

  ngOnInit() {
    const text = 'There are only 10 types of people in the world: Those who understand binary, and those who don\'t';
    const textPos = 0; // initialise text position
    const speed = 80; // time delay of print out
    this.typewriter(text, textPos, speed);
  }

  private typewriter(text, textPos, speed) {
    const sContents = ' ';
    this.customText = sContents + text.substring(0, textPos) + '_';
    textPos += 1;
    if (textPos - 1 === text.length) {
      return;
    } else {
      setTimeout(() => { this.typewriter(text, textPos, speed); }, speed);
    }
  }
}
