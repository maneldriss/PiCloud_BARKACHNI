import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import {environment} from "../../environments/environment";

export interface WeatherData {
  temperature: number;
  conditions: string;
  description: string;
  icon: string;
  location: string;
}

export interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
  }
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = environment.weatherAPI.apiKey;
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  getCurrentPosition(): Observable<GeolocationPosition> {
    return new Observable(observer => {
      if (!navigator.geolocation) {
        observer.error('Geolocation is not supported by your browser');
      } else {
        navigator.geolocation.getCurrentPosition(
          position => {
            observer.next(position);
            observer.complete();
          },
          error => {
            console.log('Geolocation error:', error);
            observer.error('Unable to retrieve your location');
          },
          { timeout: 10000 }
        );
      }
    });
  }

  getWeatherFromCurrentLocation(): Observable<WeatherData | null> {
    console.log('Getting weather from current location...');

    return this.getCurrentPosition().pipe(
      switchMap(position => {
        console.log('Got position:', position.coords);
        return this.getWeatherByCoordinates(position.coords.latitude, position.coords.longitude);
      }),
      catchError(error => {
        console.error('Error getting position:', error);
        return this.getWeatherByCity('Paris');
      })
    );
  }

  getWeatherByCoordinates(lat: number, lon: number): Observable<WeatherData | null> {
    console.log(`Getting weather for coordinates: ${lat}, ${lon}`);
    return this.http.get<any>(`${this.apiUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`)
      .pipe(
        map(response => {
          console.log('Weather API response:', response);
          return {
            temperature: response.main.temp,
            conditions: response.weather[0].main,
            description: response.weather[0].description,
            icon: response.weather[0].icon,
            location: response.name
          };
        }),
        catchError(error => {
          console.error('Error fetching weather data:', error);
          return of(null);
        })
      );
  }

  getWeatherByCity(city: string): Observable<WeatherData | null> {
    console.log(`Getting weather for city: ${city}`);
    return this.http.get<any>(`${this.apiUrl}?q=${city}&units=metric&appid=${this.apiKey}`)
      .pipe(
        map(response => {
          console.log('Weather API response:', response);
          return {
            temperature: response.main.temp,
            conditions: response.weather[0].main,
            description: response.weather[0].description,
            icon: response.weather[0].icon,
            location: response.name
          };
        }),
        catchError(error => {
          console.error('Error fetching weather data:', error);
          return of(null);
        })
      );
  }

  getSeasonForTemperature(temperature: number): string {
    if (temperature > 25) {
      return 'Summer';
    } else if (temperature > 15) {
      return 'Spring';
    } else if (temperature > 5) {
      return 'Fall';
    } else {
      return 'Winter';
    }
  }

  getOccasionForWeather(conditions: string): string | null {
    switch (conditions) {
      case 'Rain':
      case 'Drizzle':
      case 'Thunderstorm':
        return 'Rainy';
      case 'Snow':
        return 'Snowy';
      case 'Clear':
        return 'Sunny';
      default:
        return null;
    }
  }


}
