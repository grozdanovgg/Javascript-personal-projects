import { WeatherDataModelV1 } from './../models/weatherDataModelV1';
import { WeatherService } from './../services/weather.service';
import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Response } from '@angular/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  currentCity: string;
  private currentPosition: { lat: number, long: number };

  constructor(public weatherService: WeatherService, private router: Router) { }

  ngOnInit() { }

  public goToCity(selected) {
    this.router.navigate(['/location/' + selected]);
  }
  public getCurrentLocationData() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.currentPosition = { lat: pos.coords.latitude, long: pos.coords.longitude };
          this.weatherService.getWeatherData(`${this.currentPosition.lat},${this.currentPosition.long}`)
            .subscribe((weatherData) => {
              this.currentCity = this.weatherService.cityName;
              // this.router.navigate(['/location/' + this.currentCity]);
            },
            err => console.log(err) // Handle err when no Location found;
            );
        },
        (err) => console.log(err) // Handle err CAN`T get current location;
      );
    }
  }
}


