import { Injectable } from '@angular/core';
import { OutfitService } from "./outfit.service";
import { WeatherData, WeatherService } from "./weather.service";
import { combineLatest, map, of, tap, switchMap } from "rxjs";
import { AIOutfitRecommendationService } from "./ai-outfit-recommendation.service";
import {Outfit} from "../../models/Dressing/outfit.model";

@Injectable({
  providedIn: 'root'
})
export class OutfitRecommendationService {

  private lastRecommendation: Outfit | null = null;
  private lastWeather: WeatherData | null = null;

  constructor(
    private outfitService: OutfitService,
    private weatherService: WeatherService,
    private aiRecommendationService: AIOutfitRecommendationService
  ) {}

  getWeatherBasedRecommendation() {
    console.log('Getting AI-based outfit recommendation...');
    return combineLatest([
      this.outfitService.getOutfits(),
      this.weatherService.getWeatherFromCurrentLocation()
    ]).pipe(
      tap(([outfits, weather]) => {
        console.log('Got outfits:', outfits);
        console.log('Got weather:', weather);
      }),
      switchMap(([outfits, weather]) => {
        if (!weather || outfits.length === 0) {
          console.log('No weather data or outfits available');
          return of({outfit: null, weather});
        }

        const season = this.weatherService.getSeasonForTemperature(weather.temperature);
        const occasion = this.weatherService.getOccasionForWeather(weather.conditions);

        console.log(`Determined season: ${season}, occasion: ${occasion}`);

        // Step 1: Filter by season and occasion as a first pass
        let matchingOutfits = outfits.filter(outfit =>
          outfit.season === season &&
          (occasion ? outfit.occasion === occasion : true)
        );

        console.log(`Found ${matchingOutfits.length} outfits matching both season and occasion`);

        // If no matches with both criteria, fall back to season only
        if (matchingOutfits.length === 0) {
          matchingOutfits = outfits.filter(outfit => outfit.season === season);
          console.log(`Found ${matchingOutfits.length} outfits matching season only`);
        }

        // If still no matches, use all outfits
        if (matchingOutfits.length === 0) {
          console.log('No matching outfits found, using all available outfits');
          matchingOutfits = outfits;
        }

        // Step 2: Use AI to find the best matching outfit for the weather
        return this.aiRecommendationService.findBestOutfitForWeather(
          matchingOutfits,
          weather,
          season
        ).pipe(
          map(outfit => {
            this.lastRecommendation = outfit;
            this.lastWeather = weather;

            console.log('Selected AI outfit recommendation:', outfit);
            return {outfit, weather};
          })
        );
      })
    );
  }

  getLastRecommendation() {
    return {outfit: this.lastRecommendation, weather: this.lastWeather};
  }
}
