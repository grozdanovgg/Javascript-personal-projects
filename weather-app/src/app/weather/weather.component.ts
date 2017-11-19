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
  weatherData: WeatherDataModelV1;

  private currentPosition: { lat: number, long: number };
  private currentCity: string;

  constructor(private weatherService: WeatherService, private router: Router) { }

  ngOnInit() {


  }

  public goToCity(selected) {
    this.router.navigate(['/location/' + selected]);
  }
  public getCurrentLocationData() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.currentPosition = { lat: pos.coords.latitude, long: pos.coords.longitude };
          console.log(this.currentPosition);
          this.weatherService.getWeatherData(`${this.currentPosition.lat},${this.currentPosition.long}`)
            .subscribe((weatherData) => {
              // this.weatherData = weatherData;
              this.currentCity = weatherData.location.name;
              console.log(weatherData);
              console.log(this.currentCity);
            },
            err => console.log(err) // Handle err when no Location found;
            );
        },
        (err) => console.log(err) // Handle err CAN`T get current location;
      );
    }
  }
  // public search(cityName) {
  //   this.weatherService.city(cityName)
  //     .subscribe((weatherData) => {
  //       this.weatherData = weatherData;

  //       this.currentCity = weatherData.location.name;
  //       console.log(weatherData);
  //       console.log(this.currentCity);
  //     },
  //     err => console.log(err) // Handle err when no city found;
  //     );
  // }
}


