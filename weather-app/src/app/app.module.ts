import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatChipsModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatSnackBarModule,
  MatTableModule,
} from '@angular/material';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { WeatherComponent } from './weather/weather.component';
import { WeatherService } from './services/weather.service';
import { LocationWeatherComponent } from './weather/location-weather/location-weather.component';
import { LocationForecastComponent } from './weather/location-forecast/location-forecast.component';
import { FlexLayoutModule, BREAKPOINTS } from '@angular/flex-layout';
import { CUSTOM_BREAKPOINT_FACTORY } from './custom-breakpoints.component';

const routes: Routes = [
  { path: '', component: WeatherComponent },
  { path: 'location', component: LocationWeatherComponent },
  { path: 'location/:name', component: LocationWeatherComponent },
  { path: 'location/:name/forecast', component: LocationForecastComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WeatherComponent,
    LocationWeatherComponent,
    LocationForecastComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    FormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatTableModule,
  ],
  providers: [
    WeatherService,
    DatePipe,
    UpperCasePipe,
    {
      provide: BREAKPOINTS,
      useFactory: CUSTOM_BREAKPOINT_FACTORY
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
