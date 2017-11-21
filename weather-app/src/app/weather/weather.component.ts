import { ErrorHandlingService } from './../services/error-handling.service';
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

  constructor(
    public weatherService: WeatherService,
    private router: Router,
    private errorHandlingService: ErrorHandlingService,
  ) { }

  ngOnInit() {
  }

  public goToCity(selected) {
    this.weatherService.getWeatherData(selected)
      .subscribe((res) => {
        if (this.weatherService.weatherData.error) {
          const msg: string = this.weatherService.weatherData.error.message;
          this.errorHandlingService.handleError(msg);
          this.router.navigate(['/']);
          return;
        }
        this.router.navigate(['/location/' + selected]);

      },
      err => this.errorHandlingService.handleError('Invalid location')
      );
  }
  public getCurrentLocationData() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.currentPosition = { lat: pos.coords.latitude, long: pos.coords.longitude };
          this.weatherService.getWeatherData(`${this.currentPosition.lat},${this.currentPosition.long}`)
            .subscribe((weatherData) => {
              this.currentCity = this.weatherService.cityName;
            },
            err => this.errorHandlingService.handleError(err) // Handle err when no Location found;
            );
        },
        err => this.errorHandlingService.handleError(err.message, err.code)  // Handle err CAN`T get current location;
      );
    }
  }
}


