  import {Component, OnDestroy, OnInit} from '@angular/core';
  import {Outfit} from "../../../../models/Dressing/outfit.model";
  import {WeatherData} from "../../../../services/Dressing/weather.service";
  import {Item} from "../../../../models/Dressing/item.model";
  import {finalize, Subscription} from "rxjs";
  import {OutfitService} from "../../../../services/Dressing/outfit.service";
  import {ItemService} from "../../../../services/Dressing/item.service";
  import {OutfitRecommendationService} from "../../../../services/Dressing/outfit-recommendation.service";
  import {MatSnackBar} from "@angular/material/snack-bar";
  import {UserService} from "../../../../services/user/user.service";
  import {PageEvent} from "@angular/material/paginator";
  import {User} from "../../../../models/user";
  import {AuthService} from "../../../../services/auth/auth.service";

  @Component({
    selector: 'app-outfit-list',
    templateUrl: './outfit-list.component.html',
    styleUrls: ['./outfit-list.component.css']
  })
  export class OutfitListComponent implements OnInit,OnDestroy {
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

    showSwiper = false;
    itemsByCategory: { [category: string]: Item[] } = {};

    showItemSwiper = false;
    swiperItems: Item[] = [];

    private userSubscription: Subscription | null = null;
    private currentUser: User | null = null;

    constructor(
      private outfitService: OutfitService,
      private itemService: ItemService,
      private snackBar: MatSnackBar,
      private recommendationService: OutfitRecommendationService,
      private authService: AuthService
    ) { }

    ngOnInit(): void {
      const currentUser = this.authService.getCurrentUser();

      if (currentUser && currentUser.id) {
        this.loadOutfitsAndRecommendation(currentUser.id);
        this.loadItemsByCategory(currentUser.id);
      } else {
        console.error('No user is logged in');
        this.snackBar.open('Failed to load user data', 'Close', { duration: 3000 });
      }
    }

    launchItemSwiper(): void {
      if (!this.currentUser?.id) {
        this.snackBar.open('User not available', 'Close', { duration: 3000 });
        return;
      }

      this.itemService.getItemsByUser(this.currentUser.id).subscribe({
        next: (items) => {
          this.swiperItems = this.shuffleArray(items);
          this.showItemSwiper = true;
        },
        error: (err) => {
          console.error('Error loading items:', err);
          this.snackBar.open('Failed to load items', 'Close', { duration: 3000 });
        }
      });
    }

    ngOnDestroy(): void {
      if (this.userSubscription) {
        this.userSubscription.unsubscribe();
      }
    }


    private shuffleArray(array: Item[]): Item[] {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    }

    onSwiperClosed(): void {
      this.showItemSwiper = false;
    }

    loadOutfitsAndRecommendation(userId: number): void {
      this.loading = true;
      this.loadingRecommendation = true;

      this.outfitService.getOutfitsByUser(userId).subscribe({
        next: (outfits) => {
          this.outfits = outfits;
          this.extractAllFilterOptions();
          this.updateAvailableFilterOptions();
          this.applyFilters();
          this.loading = false;
          this.getRecommendation();
        },
        error: (error) => {
          console.error('Error loading outfits:', error);
          this.snackBar.open('Failed to load outfits', 'Close', { duration: 3000 });
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

    loadItemsByCategory(userId: number): void {
      this.itemService.getItemsByUser(userId).subscribe({
        next: (items) => {
          this.itemsByCategory = items.reduce((acc, item) => {
            if (!acc[item.category]) {
              acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
          }, {} as { [category: string]: Item[] });
        },
        error: (error) => {
          console.error('Error loading items:', error);
          this.snackBar.open('Failed to load items', 'Close', { duration: 3000 });
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

