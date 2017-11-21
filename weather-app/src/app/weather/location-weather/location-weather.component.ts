import { WeatherDataModelV1 } from './../../models/weatherDataModelV1';
import { WeatherService } from './../../services/weather.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/do';
import { Output } from '@angular/core/src/metadata/directives';

@Component({
  selector: 'app-location-weather',
  templateUrl: './location-weather.component.html',
  styleUrls: ['./location-weather.component.css']
})
export class LocationWeatherComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
    public weatherService: WeatherService,
    private router: Router) { }

  goTo48HoursForecast(cityName) {
    this.router.navigate([`/location/${cityName}/forecast`]);
  }

  ngOnInit() {
    if (!this.weatherService.cityName) {
      this.activatedRoute.params
        .subscribe((params) => this.weatherService.getWeatherData(params.name)
          .subscribe()
        );
    }
  }
}
