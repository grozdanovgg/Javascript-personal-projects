import { WeatherService } from './../../services/weather.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-location-weather',
  templateUrl: './location-weather.component.html',
  styleUrls: ['./location-weather.component.css']
})
export class LocationWeatherComponent implements OnInit {

  constructor(public weatherService: WeatherService) { }

  ngOnInit() {

  }
}
