import {Component, OnInit} from '@angular/core';
import {Outfit} from "../../../core/models/outfit.model";
import {OutfitService} from "../../../core/services/outfit.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {PageEvent} from "@angular/material/paginator";
import {WeatherData, WeatherService} from "../../../core/services/weather.service";
import {OutfitRecommendationService} from "../../../core/services/outfit-recommendation.service";
import {finalize} from "rxjs";

@Component({
  selector: 'app-outfit-list',
  templateUrl: './outfit-list.component.html',
  styleUrls: ['./outfit-list.component.css']
})
export class OutfitListComponent implements OnInit {
  outfits: Outfit[] = [];
  filteredOutfits: Outfit[] = [];
  paginatedOutfits: Outfit[] = [];
  loading = true;

  weatherData: WeatherData | null = null;
  recommendedOutfit: Outfit | null = null;
  showRecommendation = true;
  loadingRecommendation = true;

  searchTerm: string = '';
  showAdvancedFilters: boolean = false;

  pageSize: number = 10;
  currentPage: number = 0;

  allSeasons: string[] = ['Spring', 'Summer', 'Fall', 'Winter'];
  allOccasions: string[] = [];

  selectedSeason: string = 'ALL';
  selectedOccasion: string = 'ALL';

  availableSeasons: string[] = [];
  availableOccasions: string[] = [];

  constructor(
    private outfitService: OutfitService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private recommendationService: OutfitRecommendationService,
    private weatherService: WeatherService
  ) { }

  ngOnInit(): void {
    this.loadOutfitsAndRecommendation();
  }

  loadOutfitsAndRecommendation(): void {
    this.loading = true;
    this.loadingRecommendation = true;

    console.log('Starting to load outfits and recommendations');

    this.outfitService.getOutfits().subscribe({
      next: (outfits) => {
        console.log('Loaded outfits:', outfits);
        this.outfits = outfits;
        this.extractAllFilterOptions();
        this.updateAvailableFilterOptions();
        this.applyFilters();
        this.loading = false;

        this.getRecommendation();
      },
      error: (error) => {
        console.error('Error loading outfits:', error);
        this.snackBar.open('Failed to load outfits', 'Close', {
          duration: 3000
        });
        this.loading = false;
        this.loadingRecommendation = false;
      }
    });
  }

  getRecommendation(): void {
    console.log('Getting weather-based recommendation');

    this.recommendationService.getWeatherBasedRecommendation()
      .pipe(finalize(() => this.loadingRecommendation = false))
      .subscribe({
        next: (result) => {
          console.log('Got recommendation result:', result);
          this.weatherData = result.weather;
          this.recommendedOutfit = result.outfit;

          if (this.recommendedOutfit) {
            this.outfits = this.outfits.filter(o =>
              o.outfitID !== this.recommendedOutfit?.outfitID
            );
            this.applyFilters();
          }
        },
        error: (error) => {
          console.error('Error getting recommendation:', error);
          this.snackBar.open('Could not get weather data', 'Close', {
            duration: 3000
          });
        }
      });
  }

  loadOutfits(): void {
    this.loading = true;
    this.outfitService.getOutfits().subscribe({
      next: (outfits) => {
        this.outfits = outfits;
        this.extractAllFilterOptions();
        this.updateAvailableFilterOptions();
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load outfits', 'Close', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  extractAllFilterOptions() {
    this.allOccasions = [...new Set(this.outfits
      .map(outfit => outfit.occasion)
      .filter(occasion => occasion))] as string[];
  }

  updateAvailableFilterOptions() {
    let filteredSubset = [...this.outfits];

    if (this.selectedSeason !== 'ALL') {
      filteredSubset = filteredSubset.filter(outfit => outfit.season === this.selectedSeason);
    }

    if (this.selectedOccasion !== 'ALL') {
      filteredSubset = filteredSubset.filter(outfit => outfit.occasion === this.selectedOccasion);
    }

    this.availableSeasons = [...new Set(filteredSubset
      .map(outfit => outfit.season)
      .filter(season => season))] as string[];

    this.availableOccasions = [...new Set(filteredSubset
      .map(outfit => outfit.occasion)
      .filter(occasion => occasion))] as string[];
  }

  applyFilters() {
    let result = [...this.outfits];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(outfit =>
        outfit.name.toLowerCase().includes(term) ||
        (outfit.description && outfit.description.toLowerCase().includes(term))
      );
    }

    if (this.selectedSeason !== 'ALL') {
      result = result.filter(outfit => outfit.season === this.selectedSeason);
    }

    if (this.selectedOccasion !== 'ALL') {
      result = result.filter(outfit => outfit.occasion === this.selectedOccasion);
    }

    this.filteredOutfits = result;
    this.updatePaginatedOutfits();
    this.updateAvailableFilterOptions();
  }

  updatePaginatedOutfits() {
    const startIndex = this.currentPage * this.pageSize;
    this.paginatedOutfits = this.filteredOutfits.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedOutfits();
  }

  toggleAdvancedFilters() {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  onFilterChange(filterType: string, value: any) {
    switch(filterType) {
      case 'season':
        this.selectedSeason = value;
        break;
      case 'occasion':
        this.selectedOccasion = value;
        break;
    }

    this.applyFilters();
    this.currentPage = 0;
  }

  resetFilters() {
    this.selectedSeason = 'ALL';
    this.selectedOccasion = 'ALL';
    this.searchTerm = '';
    this.applyFilters();
    this.currentPage = 0;
  }

  clearSearch() {
    this.searchTerm = '';
    this.applyFilters();
  }

  deleteOutfit(id: number): void {
    if (confirm('Are you sure you want to delete this outfit?')) {
      this.outfitService.deleteOutfit(id).subscribe({
        next: () => {
          this.loadOutfits();
          this.snackBar.open('Outfit deleted successfully', 'Close', {
            duration: 3000
          });
        },
        error: () => {
          this.snackBar.open('Failed to delete outfit', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }

  dismissRecommendation(): void {
    console.log('Dismissing recommendation');
    this.showRecommendation = false;
    if (this.recommendedOutfit) {
      this.outfits.push(this.recommendedOutfit);
      this.applyFilters();
    }
  }

  refreshWeather(): void {
    this.loadingRecommendation = true;
    this.getRecommendation();
  }
}
