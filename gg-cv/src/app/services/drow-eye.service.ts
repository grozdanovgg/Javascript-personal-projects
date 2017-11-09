import { Injectable } from '@angular/core';
import * as $ from 'jquery';

@Injectable()
export class DrowEyeService {

  constructor() { }

  draw(eyecontainer, pupil, eyeposx, eyeposy, eyer) {
    $('.monstereyes').append(`<div class="eyecontainer" id="${eyecontainer}"><div class="pupil" id="${pupil}"></div></div>`);


    const eyecontainerSelector = '#' + eyecontainer;
    const pupilSelector = '#' + pupil;

    $(eyecontainerSelector).css({ left: eyeposx, top: eyeposy });
    $(eyecontainerSelector).css({ width: eyer, height: eyer });
    $(pupilSelector).css({ width: eyer * 0.4, height: eyer * 0.4 });
    $(pupilSelector).css({ position: 'relative', background: 'white', 'border-radius': '50%' });
    $(eyecontainerSelector).css({ position: 'relative', overflow: 'hidden', 'border-radius': '50%' });

    // Initialise core variables
    const r = $(pupilSelector).width() / 2;
    const center = {
      x: $(eyecontainerSelector).width() / 2 - r,
      y: $(eyecontainerSelector).height() / 2 - r
    };
    const distanceThreshold = $(eyecontainerSelector).width() / 2 - r;
    let mouseX = center.x;
    let mouseY = center.y;

    const elX = document.getElementById(eyecontainer).getBoundingClientRect().left;
    const elY = document.getElementById(eyecontainer).getBoundingClientRect().top;

    // Listen for mouse movement
    $(window).mousemove(e => {
      const d = {
        // x: e.pageX,
        // y: e.pageY
        x: e.pageX - r - elX - mouseX,
        y: e.pageY - r - elY - mouseY
      };

      const distance = Math.sqrt(d.x * d.x + d.y * d.y);
      if (distance < distanceThreshold) {
        mouseX = e.pageX - elX - r;
        mouseY = e.pageY - elY - r;
      } else {
        mouseX = d.x / distance * distanceThreshold + center.x;
        mouseY = d.y / distance * distanceThreshold + center.y;
      }
    });

    // Update pupil location
    const pupilEl = $(pupilSelector);
    let xp = center.x;
    let yp = center.y;
    const loop = setInterval(function () {
      // change 1 to alter damping/momentum - higher is slower
      xp += (mouseX - xp) / 1;
      yp += (mouseY - yp) / 1;
      pupilEl.css({ left: xp, top: yp });
    }, 1);
  }
}
