import {Component, Input, Output, EventEmitter, HostListener, OnInit} from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';
import {timer} from "rxjs";
import {Item} from "../../../../models/Dressing/item.model";
import {OutfitService} from "../../../../services/Dressing/outfit.service";
import {Category} from "../../../../models/Dressing/category.enum";

interface ColorCompatibility {
  [key: string]: string[];
}

interface CategoryCompatibility {
  [key: string]: Category[];
}

@Component({
  selector: 'app-outfit-swiper',
  templateUrl: './outfit-swiper.component.html',
  styleUrls: ['./outfit-swiper.component.css']
})
export class OutfitSwiperComponent implements OnInit {
  @Input() items: Item[] = [];
  @Output() closed = new EventEmitter<void>();

  rotation = 0;
  currentPosition = {x: 0, y: 0};
  likeOpacity = 0;
  nopeOpacity = 0;

  currentIndex = 0;
  startPosition = {x: 0, y: 0};
  isDragging = false;
  likedItems: Set<Item> = new Set();
  dislikedItems: Set<Item> = new Set();
  streakCount = 0;
  maxStreak = 4;
  comboMultiplier = 1;
  lastSwipeDirection = 0;
  swipeVelocity = 0;
  swipeStartTime = 0;
  swipeEndTime = 0;

  interactionCount = 0;
  nextAIInterventionThreshold = 0;

  private seasons = ['spring', 'summer', 'fall', 'winter'];
  private currentSeason = '';

  private occasions = ['casual', 'formal', 'business', 'party', 'workout'];
  private detectedOccasion = '';

  loadingAI = true; // Start with loading state
  loadingMessage = 'AI is analyzing your style preferences...';
  lastInteractionDirection = 0; // 0=none, 1=like, -1=dislike
  aiPatternDetected = false;

  aiThinkingMessages = [
    'AI is analyzing your options...',
    'Finding items that match your style...',
    'Calculating style compatibility...',
    'Processing your preferences...',
    'Preparing personalized recommendations...',
    'Learning from your previous choices...',
    'Optimizing outfit suggestions...',
    'Evaluating pattern matches...',
    'Refining selection algorithm...',
    'Identifying style patterns in your choices...'
  ];

  dislikeMessages = [
    'Noted! AI will show fewer items like this.',
    'Got it! Adjusting recommendations...',
    'Understood! Refining your preferences...',
    'Removing similar items from your feed.'
  ];

  likeMessages = [
    'Great choice! Finding more like this.',
    'Noted! Will recommend similar items.',
    'Good eye! Adding to your preference profile.',
    'Perfect! Adjusting your style matches.'
  ];

  // Animation states
  isAnimating = false;
  cardScale = 1;
  cardOpacity = 1;

  // Color compatibility matrix
  private colorCompatibility: ColorCompatibility = {
    'black': ['white', 'gray', 'red', 'blue', 'green', 'yellow', 'purple', 'pink'],
    'white': ['black', 'gray', 'red', 'blue', 'green', 'yellow', 'purple', 'pink'],
    'gray': ['black', 'white', 'red', 'blue', 'green', 'yellow', 'purple', 'pink'],
    'red': ['black', 'white', 'gray', 'blue', 'green', 'yellow'],
    'blue': ['black', 'white', 'gray', 'red', 'green', 'yellow'],
    'green': ['black', 'white', 'gray', 'red', 'blue', 'yellow'],
    'yellow': ['black', 'white', 'gray', 'red', 'blue', 'green'],
    'purple': ['black', 'white', 'gray', 'pink'],
    'pink': ['black', 'white', 'gray', 'purple']
  };

  private complementaryColors: ColorCompatibility = {
    'red': ['green'],
    'green': ['red'],
    'blue': ['orange'],
    'orange': ['blue'],
    'yellow': ['purple'],
    'purple': ['yellow'],
    'black': ['white'],
    'white': ['black']
  };

  // Category compatibility matrix
  private categoryCompatibility: CategoryCompatibility = {
    [Category.TOPS]: [Category.PANTS, Category.ACCESSORIES, Category.SHOES],
    [Category.SHIRTS]: [Category.PANTS, Category.ACCESSORIES, Category.SHOES],
    [Category.PANTS]: [Category.TOPS, Category.SHIRTS, Category.ACCESSORIES, Category.SHOES],
    [Category.DRESSES]: [Category.ACCESSORIES, Category.SHOES],
    [Category.OUTERWEAR]: [Category.TOPS, Category.SHIRTS, Category.PANTS, Category.ACCESSORIES],
    [Category.SHOES]: [Category.TOPS, Category.SHIRTS, Category.PANTS, Category.DRESSES, Category.ACCESSORIES],
    [Category.ACCESSORIES]: [Category.TOPS, Category.SHIRTS, Category.PANTS, Category.DRESSES, Category.OUTERWEAR, Category.SHOES],
    [Category.JEWELRY]: [Category.TOPS, Category.SHIRTS, Category.PANTS, Category.DRESSES, Category.OUTERWEAR],
    [Category.BAGS]: [Category.TOPS, Category.SHIRTS, Category.PANTS, Category.DRESSES, Category.OUTERWEAR]
  };

  // Style compatibility weights
  private styleWeights = {
    colorMatch: 0.4,
    categoryMatch: 0.3,
    brandMatch: 0.2,
    styleMatch: 0.1
  };

  // Track shown items to avoid duplicates
  private shownItems = new Set<number>();
  private lastShownCategory: Category | null = null;
  private consecutiveAccessories = 0;
  private maxConsecutiveAccessories = 2;
  private categoryCounts: Map<Category, number> = new Map();
  private maxItemsPerCategory = 2;

  constructor(
    private outfitService: OutfitService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    // Initialize category counts
    Object.values(Category).forEach(category => {
      this.categoryCounts.set(category, 0);
    });
  }

  private detectOccasionPreference(preferences: any) {
    // Check liked items descriptions for occasion mentions
    let occasionCounts = new Map<string, number>();

    this.occasions.forEach(occasion => {
      occasionCounts.set(occasion, 0);
    });

    this.likedItems.forEach(item => {
      const description = item.description || '';
      this.occasions.forEach(occasion => {
        if (description.toLowerCase().includes(occasion)) {
          const count = occasionCounts.get(occasion) || 0;
          occasionCounts.set(occasion, count + 1);
        }
      });
    });

    // Find the most common occasion
    let maxCount = 0;
    let maxOccasion = '';

    occasionCounts.forEach((count, occasion) => {
      if (count > maxCount) {
        maxCount = count;
        maxOccasion = occasion;
      }
    });

    if (maxCount > 0) {
      this.detectedOccasion = maxOccasion;
      return true;
    }

    return false;
  }

  get currentItem(): Item | null {
    return this.items[this.currentIndex] || null;
  }

  get nextItem(): Item | null {
    return this.items[this.currentIndex + 1] || null;
  }

  onPanStart(event: any): void {
    if (this.isAnimating) return;

    this.rotation = 0;
    this.swipeStartTime = Date.now();
    this.swipeVelocity = 0;
    this.cardScale = 1;
  }

  onPanMove(event: any): void {
    if (this.isAnimating) return;

    this.currentPosition.x = event.deltaX;
    this.currentPosition.y = event.deltaY;
    this.rotation = event.deltaX / 20;
    this.swipeVelocity = event.velocityX;

    // Scale effect based on swipe distance
    const scaleFactor = 1 - Math.abs(event.deltaX) / 1000;
    this.cardScale = Math.max(0.8, scaleFactor);

    const opacity = Math.min(Math.abs(event.deltaX) / 150, 1);
    if (event.deltaX > 0) {
      this.likeOpacity = opacity;
      this.nopeOpacity = 0;
    } else {
      this.nopeOpacity = opacity;
      this.likeOpacity = 0;
    }
  }

  onPanEnd(event: any): void {
    if (this.isAnimating) return;

    this.swipeEndTime = Date.now();
    const swipeDuration = this.swipeEndTime - this.swipeStartTime;
    const threshold = 150;
    const velocityThreshold = 0.3;
    const shouldSwipe =
      Math.abs(event.deltaX) > threshold || Math.abs(this.swipeVelocity) > velocityThreshold;

    if (shouldSwipe) {
      const direction = event.deltaX > 0 ? 1 : -1;
      this.lastSwipeDirection = direction;
      this.animateSwipe(direction);

      if (direction > 0) {
        this.processItemAction(true);
      } else {
        this.processItemAction(false);
      }
    } else {
      this.resetPosition();
    }
  }

  animateSwipe(direction: number): void {
    this.isAnimating = true;
    this.currentPosition.x = direction * 1000;
    this.currentPosition.y += 100;
    this.rotation = direction * 45;
    this.cardScale = 0.8;
    this.cardOpacity = 0;

    setTimeout(() => {
      this.likeOpacity = 0;
      this.nopeOpacity = 0;
      this.resetCardPosition(true);
      this.isAnimating = false;
    }, 300);
  }

  resetCardPosition(next: boolean = false): void {
    this.currentPosition = {x: 0, y: 0};
    this.rotation = 0;
    this.likeOpacity = 0;
    this.nopeOpacity = 0;
    this.cardScale = 1;
    this.cardOpacity = 1;

    if (next) {
      this.loadNextCard();
    }
  }

  loadNextCard() {
    this.currentIndex++;

    if (this.currentIndex >= this.items.length) {
      const nextItem = this.getNextItem();
      if (nextItem) {
        this.items = [...this.items, nextItem];
      } else {
        this.items = [];
        this.currentIndex = 0;
        this.closed.emit();
        return;
      }
    }

    if (Math.random() < 0.14) {
      this.simulateAIProcessing();
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (this.loadingAI) return;

    this.isDragging = true;
    this.startPosition = {x: event.clientX, y: event.clientY};
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging || this.loadingAI) return;

    this.currentPosition = {
      x: event.clientX - this.startPosition.x,
      y: event.clientY - this.startPosition.y
    };

    this.rotation = this.currentPosition.x / 15;
    this.likeOpacity = Math.max(0, this.currentPosition.x / 250);
    this.nopeOpacity = Math.max(0, -this.currentPosition.x / 250);
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (!this.isDragging || this.loadingAI) return;
    this.isDragging = false;

    const minSwipeDistance = 130;

    if (this.currentPosition.x > minSwipeDistance) {
      this.like();
    } else if (this.currentPosition.x < -minSwipeDistance) {
      this.dismiss();
    } else {
      this.resetPosition();
    }
  }

  like() {
    this.processItemAction(true);
  }

  dismiss() {
    this.processItemAction(false);
  }

  createOutfitFromLikedItems() {
    // Only use items that were actually liked
    const likedItemsArray = Array.from(this.likedItems);

    // Ensure we have a balanced outfit
    const outfitItems = this.balanceOutfitItems(likedItemsArray);

    const newOutfit = {
      outfitName: `My Custom Outfit ${new Date().toLocaleDateString()}`,
      items: outfitItems,
      description: 'Created from liked items'
    };

    this.outfitService.addOutfit(newOutfit).subscribe({
      next: (outfit) => {
        this.snackBar.open(`New outfit created!`, 'Close', {duration: 3000});
        this.likedItems.clear();
        this.streakCount = 0;
        this.closeSwiper();
        this.router.navigate(['/outfits', outfit.outfitID]);
      },
      error: (error) => {
        this.snackBar.open('Failed to create outfit', 'Close', {duration: 3000});
      }
    });
  }

  private balanceOutfitItems(items: Item[]): Item[] {
    const categoryGroups = new Map<Category, Item[]>();

    // Group items by category
    items.forEach(item => {
      if (!categoryGroups.has(item.category)) {
        categoryGroups.set(item.category, []);
      }
      categoryGroups.get(item.category)?.push(item);
    });

    const balancedItems: Item[] = [];

    // Ensure we have at least one top and one bottom
    const tops = categoryGroups.get(Category.TOPS) || [];
    const shirts = categoryGroups.get(Category.SHIRTS) || [];
    const pants = categoryGroups.get(Category.PANTS) || [];

    // Add one top/shirt
    if (tops.length > 0) {
      balancedItems.push(tops[0]);
    } else if (shirts.length > 0) {
      balancedItems.push(shirts[0]);
    }

    // Add one pair of pants
    if (pants.length > 0) {
      balancedItems.push(pants[0]);
    }

    // Add one pair of shoes if available
    const shoes = categoryGroups.get(Category.SHOES) || [];
    if (shoes.length > 0) {
      balancedItems.push(shoes[0]);
    }

    // Add one outerwear if available
    const outerwear = categoryGroups.get(Category.OUTERWEAR) || [];
    if (outerwear.length > 0) {
      balancedItems.push(outerwear[0]);
    }

    // Add up to two accessories
    const accessories = categoryGroups.get(Category.ACCESSORIES) || [];
    const jewelry = categoryGroups.get(Category.JEWELRY) || [];
    const bags = categoryGroups.get(Category.BAGS) || [];

    const allAccessories = [...accessories, ...jewelry, ...bags];
    balancedItems.push(...allAccessories.slice(0, 2));

    return balancedItems;
  }

  nextCard() {
    this.currentIndex++;
    this.resetPosition();

    if (this.currentIndex >= this.items.length) {
      if (Math.random() < 0.4 && this.items.length > 0) {
        this.loadingAI = true;
        this.loadingMessage = 'AI is finding more items that match your preferences...';

        setTimeout(() => {
          this.loadingAI = false;
          this.items = this.items.filter((_, index) => index >= this.currentIndex);
          this.currentIndex = 0;

          if (this.items.length === 0) {
            this.closed.emit();
          }
        }, 3200);
      } else {
        this.items = this.items.filter((_, index) => index >= this.currentIndex);
        this.currentIndex = 0;
        if (this.items.length === 0) {
          this.closed.emit();
        }
      }
    }
  }

  resetPosition() {
    const cardElement = document.querySelector('.current-card') as HTMLElement;
    if (cardElement) {
      cardElement.style.transition = 'transform 0.3s ease';
      cardElement.style.transform = 'translate(0px, 0px) rotate(0deg)';
    }

    setTimeout(() => {
      this.currentPosition = {x: 0, y: 0};
      this.rotation = 0;
      this.likeOpacity = 0;
      this.nopeOpacity = 0;
    }, 300);
  }

  closeSwiper() {
    this.closed.emit();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.loadingAI) return;

    if (event.key === 'ArrowRight') {
      this.like();
    } else if (event.key === 'ArrowLeft') {
      this.dismiss();
    }
  }

  ngOnInit(): void {
    this.simulateAIProcessing(true);
    this.setNextAIInterventionThreshold();
    this.determineSeason();
  }

  private determineSeason() {
    const month = new Date().getMonth();

    if (month >= 2 && month <= 4) {
      this.currentSeason = 'spring';
    } else if (month >= 5 && month <= 7) {
      this.currentSeason = 'summer';
    } else if (month >= 8 && month <= 10) {
      this.currentSeason = 'fall';
    } else {
      this.currentSeason = 'winter';
    }
  }

  setNextAIInterventionThreshold() {
    this.nextAIInterventionThreshold = Math.floor(Math.random() * 4) + 2;
    console.log(`Next AI intervention after ${this.nextAIInterventionThreshold} interactions`);
  }

  simulateAIProcessing(isInitial: boolean = false) {
    this.loadingAI = true;

    const messageIndex = Math.floor(Math.random() * this.aiThinkingMessages.length);
    this.loadingMessage = this.aiThinkingMessages[messageIndex];

    const minDelay = isInitial ? 2200 : 1000;
    const maxDelay = isInitial ? 4500 : 3000;
    const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;

    if (randomDelay > 2500) {
      timer(1500).subscribe(() => {
        const newMessageIndex = Math.floor(Math.random() * this.aiThinkingMessages.length);
        this.loadingMessage = this.aiThinkingMessages[newMessageIndex];
      });
    }

    setTimeout(() => {
      this.loadingAI = false;

      if (!isInitial && Math.random() < 0.25) {
        const feedbackMessage = this.lastInteractionDirection > 0 ?
          this.likeMessages[Math.floor(Math.random() * this.likeMessages.length)] :
          this.dislikeMessages[Math.floor(Math.random() * this.dislikeMessages.length)];

        this.snackBar.open(feedbackMessage, 'Got it', {duration: 2000});
      }
    }, randomDelay);
  }

  processItemAction(isLike: boolean): void {
    if (!this.currentItem || this.loadingAI) return;

    this.interactionCount++;
    this.lastInteractionDirection = isLike ? 1 : -1;

    if (isLike) {
      this.likedItems.add(this.currentItem);
      this.streakCount++;
      this.comboMultiplier = Math.min(2, 1 + (this.streakCount / 4));

      // Show streak feedback
      if (this.streakCount >= this.maxStreak) {
        this.snackBar.open(`🔥 Amazing streak! ${this.streakCount}x combo!`, 'Woohoo!', {
          duration: 2000,
          panelClass: ['streak-snackbar']
        });
      }
    } else {
      this.dislikedItems.add(this.currentItem);
      this.streakCount = 0;
      this.comboMultiplier = 1;

      if (Math.random() < 0.3) {
        const dislikeIndex = Math.floor(Math.random() * this.dislikeMessages.length);
        setTimeout(() => {
          this.snackBar.open(this.dislikeMessages[dislikeIndex], 'OK', { duration: 2000 });
        }, 300);
      }
    }

    if (this.interactionCount === this.nextAIInterventionThreshold) {
      this.interactionCount = 0;
      this.setNextAIInterventionThreshold();
      this.triggerAIIntervention();
    }

    if (this.likedItems.size >= 4 && Math.random() < 0.7) {
      this.createOutfitFromLikedItems();
    }

    this.nextCard();
  }

  triggerAIIntervention() {
    setTimeout(() => {
      this.loadingAI = true;

      if (!this.aiPatternDetected && Math.random() < 0.65) {
        this.aiPatternDetected = true;
        this.loadingMessage = 'AI has detected a pattern in your preferences...';

        setTimeout(() => {
          this.loadingAI = false;

          const preferenceType = this.likedItems.size > this.dislikedItems.size ?
            'liked' : 'avoided';

          this.snackBar.open(`AI noticed you've ${preferenceType} certain styles. Adjusting recommendations!`, 'Great!', { duration: 3000 });

          if (Math.random() < 0.4) {
            setTimeout(() => {
              this.loadingAI = true;
              this.loadingMessage = 'Finding new items that match your preferences...';

              setTimeout(() => {
                this.loadingAI = false;
              }, 2500);
            }, 3500);
          }
        }, 3000);
      }
      else if (Math.random() < 0.5) {
        this.loadingMessage = 'AI is analyzing category preferences...';

        setTimeout(() => {
          this.loadingAI = false;

          const categories = ['tops', 'bottoms', 'dresses', 'accessories', 'shoes', 'outerwear'];
          const randomCategory = categories[Math.floor(Math.random() * categories.length)];

          this.snackBar.open(`Based on your choices, AI will show more ${randomCategory}`, 'Thanks!', { duration: 3000 });
        }, 2800);
      }
      else {
        this.loadingMessage = 'Analyzing color preferences...';

        setTimeout(() => {
          this.loadingAI = false;

          const colorPalettes = ['warm', 'cool', 'neutral', 'vibrant', 'pastel', 'monochrome'];
          const randomPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];

          this.snackBar.open(`AI detected your preference for ${randomPalette} colors`, 'OK', { duration: 3000 });
        }, 2500);
      }
    }, 500);
  }

  private calculateItemCompatibility(item: Item, likedItems: Item[]): number {
    let score = 0;

    likedItems.forEach(likedItem => {
      if (this.colorCompatibility[likedItem.color]?.includes(item.color)) {
        score += this.styleWeights.colorMatch;
      }
    });

    likedItems.forEach(likedItem => {
      if (this.categoryCompatibility[likedItem.category]?.includes(item.category)) {
        score += this.styleWeights.categoryMatch;
      }
    });

    const brandMatches = likedItems.filter(likedItem => likedItem.brand === item.brand).length;
    score += (brandMatches / likedItems.length) * this.styleWeights.brandMatch;

    const styleMatches = likedItems.filter(likedItem =>
      this.calculateStringSimilarity(likedItem.itemName, item.itemName) > 0.7
    ).length;
    score += (styleMatches / likedItems.length) * this.styleWeights.styleMatch;

    if (item.description && item.description.toLowerCase().includes(this.currentSeason)) {
      score += 0.2;
    }

    return score;
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    if (!str1 || !str2) return 0;

    const words1 = str1.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    const words2 = str2.toLowerCase().split(/\s+/).filter(word => word.length > 2);

    if (words1.length === 0 || words2.length === 0) return 0;

    const styleKeywords = [
      'floral', 'stripe', 'check', 'plaid', 'solid', 'print',
      'casual', 'formal', 'business', 'party', 'elegant', 'vintage',
      'slim', 'regular', 'loose', 'fitted', 'oversized',
      'leather', 'denim', 'cotton', 'silk', 'wool', 'linen'
    ];

    const str1Keywords = words1.filter(word => styleKeywords.includes(word));
    const str2Keywords = words2.filter(word => styleKeywords.includes(word));

    const commonStyleKeywords = str1Keywords.filter(word => str2Keywords.includes(word));
    const styleKeywordScore = commonStyleKeywords.length > 0 ? 0.5 : 0;

    const commonWords = words1.filter(word => words2.includes(word));
    const wordOverlapScore = commonWords.length / Math.max(words1.length, words2.length);

    return styleKeywordScore + (wordOverlapScore * 0.5);
  }

  private getNextItem(): Item | null {
    if (this.items.length === 0) return null;

    const availableItems = this.items.filter(item =>
      typeof item.itemID === 'number' && !this.shownItems.has(item.itemID)
    );

    if (availableItems.length === 0) {
      this.shownItems.clear();
      this.categoryCounts.clear();
      Object.values(Category).forEach(category => {
        this.categoryCounts.set(category, 0);
      });
      return this.items[Math.floor(Math.random() * this.items.length)];
    }

    const userPreferences = this.calculateUserPreferences();

    const scoredItems = availableItems.map(item => {
      let score = 0;

      if (this.likedItems.size > 0) {
        const likedItemsArray = Array.from(this.likedItems);
        score = this.calculateItemCompatibility(item, likedItemsArray);
      }

      score += this.calculatePersonalizationScore(item, userPreferences);

      if (this.lastSwipeDirection > 0 && this.currentItem) {
        score += this.calculatePairwiseCompatibility(this.currentItem, item) * 0.3;
      }

      const categoryCount = this.categoryCounts.get(item.category) || 0;
      score += (1 / (categoryCount + 1)) * 0.1;

      return { item, score };
    });

    scoredItems.sort((a, b) => b.score - a.score);

    const filteredItems = this.filterItemsByCategoryRules(scoredItems);

    if (filteredItems.length > 0) {
      const topN = Math.min(3, filteredItems.length);
      const selectedIndex = Math.floor(Math.random() * topN);
      const selectedItem = filteredItems[selectedIndex].item;

      if (typeof selectedItem.itemID === 'number') {
        this.shownItems.add(selectedItem.itemID);
        this.lastShownCategory = selectedItem.category;
        this.categoryCounts.set(selectedItem.category, (this.categoryCounts.get(selectedItem.category) || 0) + 1);
        return selectedItem;
      }
    }

    const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
    if (typeof randomItem.itemID === 'number') {
      this.shownItems.add(randomItem.itemID);
      this.lastShownCategory = randomItem.category;
      this.categoryCounts.set(randomItem.category, (this.categoryCounts.get(randomItem.category) || 0) + 1);
      return randomItem;
    }

    return null;
  }

  private calculatePairwiseCompatibility(item1: Item, item2: Item): number {
    let score = 0;

    if (this.colorCompatibility[item1.color]?.includes(item2.color)) {
      score += 0.4;
    }

    if (this.categoryCompatibility[item1.category]?.includes(item2.category)) {
      score += 0.4;
    }

    if (item1.brand === item2.brand) {
      score += 0.1;
    }

    if (this.complementaryColors[item1.color]?.includes(item2.color)) {
      score += 0.2; // Extra boost for complementary colors
    }

    const styleSimilarity = this.calculateStringSimilarity(item1.itemName, item2.itemName);
    score += styleSimilarity * 0.1;

    return score;
  }

  private calculateUserPreferences() {
    const preferences = {
      favoriteColors: new Map<string, number>(),
      favoriteCategories: new Map<Category, number>(),
      favoriteBrands: new Map<string, number>(),
      dislikedColors: new Map<string, number>(),
      dislikedCategories: new Map<Category, number>(),
      dislikedBrands: new Map<string, number>(),
    };

    this.likedItems.forEach(item => {
      const colorCount = preferences.favoriteColors.get(item.color) || 0;
      preferences.favoriteColors.set(item.color, colorCount + 1);

      const categoryCount = preferences.favoriteCategories.get(item.category) || 0;
      preferences.favoriteCategories.set(item.category, categoryCount + 1);

      const brandCount = preferences.favoriteBrands.get(item.brand) || 0;
      preferences.favoriteBrands.set(item.brand, brandCount + 1);
    });

    this.dislikedItems.forEach(item => {
      const colorCount = preferences.dislikedColors.get(item.color) || 0;
      preferences.dislikedColors.set(item.color, colorCount + 1);

      const categoryCount = preferences.dislikedCategories.get(item.category) || 0;
      preferences.dislikedCategories.set(item.category, categoryCount + 1);

      const brandCount = preferences.dislikedBrands.get(item.brand) || 0;
      preferences.dislikedBrands.set(item.brand, brandCount + 1);
    });

    return preferences;
  }

  private calculatePersonalizationScore(item: Item, preferences: any): number {
    let score = 0;

    const colorLikeCount = preferences.favoriteColors.get(item.color) || 0;
    const colorDislikeCount = preferences.dislikedColors.get(item.color) || 0;
    const colorScore = (colorLikeCount - colorDislikeCount) * 0.1;
    score += colorScore;

    const categoryLikeCount = preferences.favoriteCategories.get(item.category) || 0;
    const categoryDislikeCount = preferences.dislikedCategories.get(item.category) || 0;
    const categoryScore = (categoryLikeCount - categoryDislikeCount) * 0.1;
    score += categoryScore;

    const brandLikeCount = preferences.favoriteBrands.get(item.brand) || 0;
    const brandDislikeCount = preferences.dislikedBrands.get(item.brand) || 0;
    const brandScore = (brandLikeCount - brandDislikeCount) * 0.1;
    score += brandScore;

    return score;
  }

  private filterItemsByCategoryRules(scoredItems: {item: Item, score: number}[]): {item: Item, score: number}[] {
    const outfitStructure = this.determineOutfitStructure();

    return scoredItems.filter(({item, score}) => {
      const categoryCount = this.categoryCounts.get(item.category) || 0;

      if (categoryCount >= this.maxItemsPerCategory) {
        return false;
      }

      if (item.category === this.lastShownCategory &&
        ![Category.ACCESSORIES, Category.JEWELRY, Category.BAGS].includes(item.category)) {
        return false;
      }

      if ([Category.ACCESSORIES, Category.JEWELRY, Category.BAGS].includes(item.category)) {
        if (this.consecutiveAccessories >= this.maxConsecutiveAccessories) {
          return false;
        }
      } else {
        this.consecutiveAccessories = 0;
      }

      const categoryNeeded = outfitStructure[item.category] || 0;
      const currentCategoryCount = this.categoryCounts.get(item.category) || 0;

      if (currentCategoryCount >= categoryNeeded &&
        ![Category.ACCESSORIES, Category.JEWELRY, Category.BAGS].includes(item.category)) {
        return Math.random() < 0.15;
      }

      if (this.detectedOccasion && item.description &&
        item.description.toLowerCase().includes(this.detectedOccasion)) {
        score += 0.3;
      }

      return true;
    });
  }

  private determineOutfitStructure(): {[key in Category]?: number} {
    const structure: {[key in Category]?: number} = {
      [Category.TOPS]: 1,
      [Category.SHIRTS]: 1,
      [Category.PANTS]: 1,
      [Category.DRESSES]: 1,
      [Category.OUTERWEAR]: 1,
      [Category.SHOES]: 1,
      [Category.ACCESSORIES]: 2,
      [Category.JEWELRY]: 1,
      [Category.BAGS]: 1
    };

    if (this.likedItems.size > 0) {
      const likedItemsArray = Array.from(this.likedItems);
      const categoryCounts = new Map<Category, number>();

      likedItemsArray.forEach(item => {
        const count = categoryCounts.get(item.category) || 0;
        categoryCounts.set(item.category, count + 1);
      });

      categoryCounts.forEach((count, category) => {
        if (count > 0) {
          structure[category] = Math.max(structure[category] || 0, 1);
        }
      });

      if (categoryCounts.get(Category.DRESSES) || 0 > 0) {
        structure[Category.TOPS] = 0;
        structure[Category.PANTS] = 0;
      }
    }

    return structure;
  }
}

