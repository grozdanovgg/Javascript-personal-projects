import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { configTypewriter, configCV } from '../config/config-main';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css']
})
export class CvComponent implements OnInit, AfterViewInit {
  protected customText: string;

  protected CVCode = '';

  protected title = configCV.title;

  constructor() {
  }

  ngOnInit() {
    this.typeWriter(configTypewriter.text, configTypewriter.speed);
  }
  ngAfterViewInit(): void {
    fetch('../../assets/testClass.text')
      .then(file => file.text())
      .then(responce => this.CVCode = responce);
  }
  private typeWriter(text, speed) {
    const textPos = 0; // initialise text position
    this.typeWriterHelper(text, textPos, speed);
  }

  private typeWriterHelper(text, textPos, speed) {
    const sContents = ' ';
    this.customText = sContents + text.substring(0, textPos) + '_';
    textPos += 1;
    if (textPos - 1 === text.length) {
      this.customText = this.customText.slice(0, textPos);
      return;
    } else {
      setTimeout(() => { this.typeWriterHelper(text, textPos, speed); }, speed);
    }
  }
}


