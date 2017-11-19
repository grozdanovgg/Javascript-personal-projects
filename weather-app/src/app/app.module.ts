import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { WeatherComponent } from './weather/weather.component';
import { WeatherService } from './services/weather.service';
import { HttpClientModule } from '@angular/common/http';
import { CityWeatherComponent } from './weather/city-weather/city-weather.component';
import { LocationForecastComponent } from './weather/city-forecast/location-forecast.component';
import { Routes, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

const routes: Routes = [
  { path: '', component: WeatherComponent },
  { path: 'location', component: CityWeatherComponent },
  { path: 'location/:name', component: CityWeatherComponent },
  { path: 'location/:name/forecast', component: LocationForecastComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WeatherComponent,
    CityWeatherComponent,
    LocationForecastComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [WeatherService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
