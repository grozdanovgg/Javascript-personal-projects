import { Component, OnInit } from '@angular/core';
import { DrowEyeService } from '../services/drow-eye.service';
import { eyes } from '../config/config-main';

@Component({
  selector: 'app-eyes',
  templateUrl: './eyes.component.html',
  styleUrls: ['./eyes.component.css']
})
export class EyesComponent implements OnInit {

  constructor(private eye: DrowEyeService) { }

  ngOnInit() {
    this.eye.draw('eye-left', 'pupil-left', 75, 133, 18);
    this.eye.draw('eye-right', 'pupil-right', 119, 115, 18);
  }

  private getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusiv
  }
}
