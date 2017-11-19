import { WeatherDataModelV1 } from './../../models/weatherDataModelV1';
import { WeatherService } from './../../services/weather.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/do';
import { Output } from '@angular/core/src/metadata/directives';

@Component({
  selector: 'app-city-weather',
  templateUrl: './city-weather.component.html',
  styleUrls: ['./city-weather.component.css']
})
export class CityWeatherComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
    public weatherService: WeatherService,
    private router: Router) { }

  goTo48HoursForecast(cityName) {
    this.router.navigate([`/location/${cityName}/forecast`]);
  }

  ngOnInit() {
    this.activatedRoute.params
      .subscribe((params) => this.weatherService.getWeatherData(params.name)
        .subscribe()
      );
  }
}
