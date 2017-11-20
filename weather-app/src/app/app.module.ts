import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { WeatherComponent } from './weather/weather.component';
import { WeatherService } from './services/weather.service';
import { HttpClientModule } from '@angular/common/http';
import { CityWeatherComponent } from './weather/city-weather/city-weather.component';
import { LocationForecastComponent } from './weather/city-forecast/location-forecast.component';
import { Routes, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UpperCasePipe } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';
// import { CustomBreakPointsProvider } from './custom-breakpoints';
import { BREAKPOINTS } from '@angular/flex-layout';
import { CUSTOM_BREAKPOINT_FACTORY } from './custom-breakpoints.component';


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
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    FormsModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
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
