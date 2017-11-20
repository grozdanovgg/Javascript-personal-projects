import { WeatherService } from './../../services/weather.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { WeatherDataModelV1 } from '../../models/weatherDataModelV1';
import { ObservableMedia } from '@angular/flex-layout';

@Component({
  selector: 'app-location-forecast',
  templateUrl: './location-forecast.component.html',
  styleUrls: ['./location-forecast.component.css']
})
export class LocationForecastComponent implements OnInit {
  currentLocationName: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    public weatherService: WeatherService,
    observableMedia: ObservableMedia
  ) { }

  ngOnInit() {
    // If user acces the route directly, then
    // activate the service to get the weatherData
    if (!this.weatherService.weatherData) {
      this.activatedRoute.params.subscribe((params) => {
        this.weatherService.getWeatherData(params.name).subscribe();
      });
    }
  }
}
