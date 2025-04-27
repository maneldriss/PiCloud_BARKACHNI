import {Component, Input, Output, EventEmitter, HostListener, OnInit} from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';
import {timer} from "rxjs";
import {Item} from "../../../../models/Dressing/item.model";
import {OutfitService} from "../../../../services/Dressing/outfit.service";

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

  interactionCount = 0;
  nextAIInterventionThreshold = 0;

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

  constructor(
    private outfitService: OutfitService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
  }

  get currentItem(): Item | null {
    return this.items[this.currentIndex] || null;
  }

  get nextItem(): Item | null {
    return this.items[this.currentIndex + 1] || null;
  }

  onPanStart(event: any): void {
    this.rotation = 0;
  }

  onPanMove(event: any): void {
    this.currentPosition.x = event.deltaX;
    this.currentPosition.y = event.deltaY;
    this.rotation = event.deltaX / 20;

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
    const threshold = 150;
    const velocityThreshold = 0.3;
    const shouldSwipe =
      Math.abs(event.deltaX) > threshold || Math.abs(event.velocityX) > velocityThreshold;

    if (shouldSwipe) {
      const direction = event.deltaX > 0 ? 1 : -1;
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
    this.currentPosition.x = direction * 1000;
    this.currentPosition.y += 100;
    this.rotation = direction * 45;

    setTimeout(() => {
      this.likeOpacity = 0;
      this.nopeOpacity = 0;
      this.resetCardPosition(true);
    }, 300);
  }

  resetCardPosition(next: boolean = false): void {
    this.currentPosition = {x: 0, y: 0};
    this.rotation = 0;
    this.likeOpacity = 0;
    this.nopeOpacity = 0;

    if (next) {
      this.loadNextCard();
    }
  }

  loadNextCard() {
    this.currentIndex++;

    if (this.currentIndex >= this.items.length) {
      this.items = [];
      this.currentIndex = 0;
      this.closed.emit();
    } else {
      if (Math.random() < 0.14) {
        this.simulateAIProcessing();
      }
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
    const newOutfit = {
      name: `My Custom Outfit ${new Date().toLocaleDateString()}`,
      items: Array.from(this.likedItems),
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

  processItemAction(isLike: boolean) {
    if (!this.currentItem || this.loadingAI) return;

    this.interactionCount++;
    this.lastInteractionDirection = isLike ? 1 : -1;

    if (isLike) {
      this.likedItems.add(this.currentItem);
    } else {
      this.dislikedItems.add(this.currentItem);

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
}

