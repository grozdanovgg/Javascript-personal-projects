import { WeatherDataModelV1, Forecast, ForecastDay, HoursData } from './../models/weatherDataModelV1';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WeatherService {
  public weatherData: WeatherDataModelV1;
  public forecastData: HoursData[];
  public cityName: string;
  public localDateTime: string;
  public localUnixTime: number;
  public conditionText: string;
  public conditionIconUrl: string;
  public temperature: number;
  public feelsLike: number;
  public windSpeed: number;
  public humidity: number;

  private rawForecastData: HoursData[];
  private weatherBaseUrl = // URL to web api
    '/api/v1/weather/';

  public getWeatherData(city): Observable<WeatherDataModelV1> {
    return this.http.get(`${this.weatherBaseUrl}${city}`)
      .do((res: { results }) => {
        console.log(res);
        this.weatherData = res.results;
        this.cityName = this.weatherData.location.name;
        this.localDateTime = this.weatherData.location.localtime;
        this.localUnixTime = this.weatherData.location.localtime_epoch;
        this.conditionText = this.weatherData.current.condition.text;
        this.conditionIconUrl = this.weatherData.current.condition.icon;
        this.temperature = this.weatherData.current.temp_c;
        this.feelsLike = this.weatherData.current.feelslike_c;
        this.windSpeed = this.weatherData.current.wind_kph;
        this.humidity = this.weatherData.current.humidity;

        this.rawForecastData = this.extractForecastData(this.weatherData.forecast.forecastday);
        this.forecastData = this.filter48HoursForecastData(this.rawForecastData);
      });
  }

  private extractForecastData(days: ForecastDay[]): HoursData[] {
    let result = [];
    days.forEach(day => {
      result = result.concat(day.hour);
    });
    return result;
  }

  private filter48HoursForecastData(allDays) {

    // Turn miliseconds to seconds
    const now = Date.now() / 1000;

    // Filter only hours ahead of current moment;
    const forecastHours = allDays.filter(day => {
      return day.time_epoch > now;
    });

    // Trim array to return only 48 hours of data
    const twoDaysHours = forecastHours.slice(0, 48);

    return twoDaysHours;
  }

  constructor(private http: HttpClient) { }
}
