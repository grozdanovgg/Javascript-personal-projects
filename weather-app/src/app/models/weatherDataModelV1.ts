export class WeatherDataModelV1 {
    current?: Current;
    forecast?: Forecast;
    location?: Location;
}
export class Forecast {
    forecastday: ForecastDay[];
}

export class ForecastDay {
    astro: { moonrise: string; moonset: string; sunrise: string; sunset: string };
    date: string;
    date_epoch: number;
    day: {
        avghumidity: number;
        avgtemp_c: number;
        avgtemp_f: number;
        avgvis_km: number;
        avgvis_miles: number;
        condition: Condition;
        maxtemp_c: number;
        maxtemp_f: number;
        maxwind_kph: number;
        maxwind_mph: number;
        mintemp_c: number;
        mintemp_f: number;
        totalprecip_in: number;
        totalprecip_mm: number;
        uv: number;
    };
    hour: HoursData[];
}

export class HoursData {
    chance_of_rain: string;
    chance_of_snow: string;
    cloud: number;
    condition: Condition;
    dewpoint_c: number;
    dewpoint_f: number;
    feelslike_c: number;
    feelslike_f: number;
    heatindex_c: number;
    heatindex_f: number;
    humidity: number;
    is_day: number;
    precip_in: number;
    precip_mm: number;
    pressure_in: number;
    pressure_mb: number;
    temp_c: number;
    temp_f: number;
    time: string;
    time_epoch: number;
    vis_km: number;
    vis_miles: number;
    will_it_rain: number;
    will_it_snow: number;
    wind_degree: number;
    wind_dir: number;
    wind_kph: number;
    wind_mph: number;
    windchill_c: number;
    windchill_f: number;
}

class Location {
    country: string;
    lat: number;
    localtime: string;
    localtime_epoch: number;
    lon: number;
    name: string;
    region: string;
    tz_id: string;
}

class Current {
    cloud: number;
    condition: Condition;
    feelslike_c: number;
    feelslike_f: number;
    humidity: number;
    is_day: number;
    last_updated: string;
    last_updated_epoch: number;
    precip_in: number;
    precip_mm: number;
    pressure_in: number;
    pressure_mb: number;
    temp_c: number;
    temp_f: number;
    vis_km: number;
    vis_miles: number;
    wind_degree: number;
    wind_dir: string;
    wind_kph: number;
    wind_mph: number;
}

class Condition {
    text: string; icon: string; code: number;
}



