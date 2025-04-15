import { Injectable } from '@angular/core';
import {Outfit} from "../models/outfit.model";
import {OutfitService} from "./outfit.service";
import {WeatherData, WeatherService} from "./weather.service";
import {combineLatest, map, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OutfitRecommendationService {

  private lastRecommendation: Outfit | null = null;
  private lastWeather: WeatherData | null = null;

  constructor(
    private outfitService: OutfitService,
    private weatherService: WeatherService
  ) {
  }

  getWeatherBasedRecommendation() {
    console.log('Getting weather-based outfit recommendation...');
    return combineLatest([
      this.outfitService.getOutfits(),
      this.weatherService.getWeatherFromCurrentLocation()
    ]).pipe(
      tap(([outfits, weather]) => {
        console.log('Got outfits:', outfits);
        console.log('Got weather:', weather);
      }),
      map(([outfits, weather]) => {
        if (!weather || outfits.length === 0) {
          console.log('No weather data or outfits available');
          return {outfit: null, weather};
        }
        const season = this.weatherService.getSeasonForTemperature(weather.temperature);
        const occasion = this.weatherService.getOccasionForWeather(weather.conditions);

        console.log(`Determined season: ${season}, occasion: ${occasion}`);

        let matchingOutfits = outfits.filter(outfit =>
          outfit.season === season &&
          (occasion ? outfit.occasion === occasion : true)
        );

        console.log(`Found ${matchingOutfits.length} outfits matching both season and occasion`);

        if (matchingOutfits.length === 0) {
          matchingOutfits = outfits.filter(outfit => outfit.season === season);
          console.log(`Found ${matchingOutfits.length} outfits matching season only`);
        }

        if (matchingOutfits.length === 0) {
          console.log('No matching outfits found, using any available outfit');
          this.lastRecommendation = outfits[0] || null;
          this.lastWeather = weather;
          return {outfit: this.lastRecommendation, weather};
        }

        const randomIndex = Math.floor(Math.random() * matchingOutfits.length);
        this.lastRecommendation = matchingOutfits[randomIndex];
        this.lastWeather = weather;

        console.log('Selected outfit recommendation:', this.lastRecommendation);
        return {outfit: this.lastRecommendation, weather};
      })
    );
  }


  getLastRecommendation() {
    return {outfit: this.lastRecommendation, weather: this.lastWeather};
  }
}
