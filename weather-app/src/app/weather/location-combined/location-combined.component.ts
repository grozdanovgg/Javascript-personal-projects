import { WeatherService } from './../../services/weather.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location-combined',
  templateUrl: './location-combined.component.html',
  styleUrls: ['./location-combined.component.css']
})
export class LocationCombinedComponent implements OnInit {
  showForecast: boolean;
  currentLocationName: string;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public weatherService: WeatherService,
  ) { }

  ngOnInit() {
    // If user acces the route directly, then
    // activate the service to get the weatherData
    if (!this.weatherService.cityName) {
      this.activatedRoute.params
        .subscribe((params) => this.weatherService.getWeatherData(params.name)
          .subscribe()
        );
    }
  }

  public goTo48HoursForecast(cityName) {
    this.router.navigate([`/location/${cityName}/forecast`]);
  }
}
