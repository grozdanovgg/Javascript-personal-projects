import { WeatherService } from './../../services/weather.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { WeatherDataModelV1 } from '../../models/weatherDataModelV1';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-location-forecast',
  templateUrl: './location-forecast.component.html',
  styleUrls: ['./location-forecast.component.css']
})
export class LocationForecastComponent implements OnInit {

  dataSource = new MatTableDataSource(this.weatherService.forecastData);

  constructor(public weatherService: WeatherService,
    private activatedRoute: ActivatedRoute,
  ) { }
  ngOnInit() {

    if (!this.weatherService.weatherData) {
      this.activatedRoute.params.subscribe((params) => {
        this.weatherService.getWeatherData(params.name)
          .subscribe(() => {
            this.dataSource = new MatTableDataSource(this.weatherService.forecastData);
          });
      });
    } else {
      this.dataSource = new MatTableDataSource(this.weatherService.forecastData);
    }
  }

}
