import {Component, OnInit} from '@angular/core';
import {Outfit} from "../../../core/models/outfit.model";
import {OutfitService} from "../../../core/services/outfit.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {PageEvent} from "@angular/material/paginator";
import {WeatherData} from "../../../core/services/weather.service";
import {OutfitRecommendationService} from "../../../core/services/outfit-recommendation.service";
import {finalize} from "rxjs";
import { Item } from 'src/app/core/models/item.model';
import {ItemService} from "../../../core/services/item.service";

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
  allOccasions: string[] = [''];

  selectedSeason: string = 'ALL';
  selectedOccasion: string = 'ALL';

  availableSeasons: string[] = [];
  availableOccasions: string[] = [];

  showSwiper = false;
  itemsByCategory: { [category: string]: Item[] } = {};

  showItemSwiper = false;
  swiperItems: Item[] = [];

  constructor(
    private outfitService: OutfitService,
    private itemService: ItemService,
    private snackBar: MatSnackBar,
    private recommendationService: OutfitRecommendationService,
  ) { }

  ngOnInit(): void {
    this.loadOutfitsAndRecommendation();
    this.loadItemsByCategory();
  }

  launchItemSwiper(): void {
    this.itemService.getItemsByUser(1).subscribe(items => {
      this.swiperItems = this.shuffleArray(items); // Shuffle items before showing
      this.showItemSwiper = true;
    });
  }

  private shuffleArray(array: Item[]): Item[] {
    return array.sort(() => Math.random() - 0.5); // Simple shuffle logic
  }

  onSwiperClosed(): void {
    this.showItemSwiper = false;
  }

  loadOutfitsAndRecommendation(): void {
    this.loading = true;
    this.loadingRecommendation = true;

    console.log('Starting to load outfits and AI recommendations');

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
    console.log('Getting AI-based outfit recommendation');
    this.loadingRecommendation = true;

    const timeoutMs = 10000; // 10 seconds
    const timeoutTimer = setTimeout(() => {
      if (this.loadingRecommendation) {
        console.log('Recommendation request timed out');
        this.loadingRecommendation = false;
        this.snackBar.open('Recommendation request timed out. Showing regular outfits instead.', 'Close', {
          duration: 5000
        });
      }
    }, timeoutMs);

    this.recommendationService.getWeatherBasedRecommendation()
      .pipe(
        finalize(() => {
          this.loadingRecommendation = false;
          clearTimeout(timeoutTimer);
        })
      )
      .subscribe({
        next: (result) => {
          console.log('Got recommendation result:', result);
          this.weatherData = result.weather;
          this.recommendedOutfit = result.outfit;

          if (this.recommendedOutfit) {
            this.snackBar.open('AI found the best outfit for today!', 'Close', {
              duration: 3000
            });
            // Remove recommended outfit from the main list to avoid duplication
            this.outfits = this.outfits.filter(o =>
              o.outfitID !== this.recommendedOutfit?.outfitID
            );
            this.applyFilters();
          }
        },
        error: (error) => {
          console.error('Error getting recommendation:', error);
          this.snackBar.open('Could not get outfit recommendations. Using regular outfits instead.', 'Close', {
            duration: 5000
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

  loadItemsByCategory(): void {
    this.itemService.getItemsByUser(1).subscribe({
      next: (items) => {
        this.itemsByCategory = items.reduce((acc, item) => {
          if (!acc[item.category]) {
            acc[item.category] = [];
          }
          acc[item.category].push(item);
          return acc;
        }, {} as { [category: string]: Item[] });
        this.launchSwiper();
      },
      error: (error) => {
        console.error('Error loading items:', error);
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
    console.log('Dismissing AI recommendation');
    this.showRecommendation = false;
    if (this.recommendedOutfit) {
      this.outfits.push(this.recommendedOutfit);
      this.applyFilters();
    }
  }

  refreshWeather(): void {
    this.loadingRecommendation = true;
    this.recommendedOutfit = null;
    this.getRecommendation();
  }

  launchSwiper(): void {
    if (Object.keys(this.itemsByCategory).length > 0) {
      this.showSwiper = true;
    } else {
      this.snackBar.open('No items available for swiping', 'Close', { duration: 3000 });
    }
  }
}

