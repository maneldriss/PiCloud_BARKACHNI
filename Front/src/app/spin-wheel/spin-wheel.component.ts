import { Component, EventEmitter, Output } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-spin-wheel',
  templateUrl: './spin-wheel.component.html',
  styleUrls: ['./spin-wheel.component.css'],
})
export class SpinWheelComponent {
  @Output() rewardSelected = new EventEmitter<string>();
  @Output() closeWheel = new EventEmitter<void>();
  showWheel = true;
  currentAngle = 0;
  showRewardModal: boolean = false;  // Make sure this is boolean
  rewardMessage: string = '';  
  isSpinning = false;
  // Initialize as empty string
  rewardType = ''; // Add this for modal display

  segments = [
    { label: '5% Discount', color: '#FF5733' },
    { label: 'Free Shipping', color: '#33FF57' },
    { label: '10% Discount', color: '#5733FF' },
    { label: '10% Discount', color: '#FFD700' },
    { label: '10% Discount', color: '#FFD700' },
    { label: '10% Discount', color: '#FFD700' },
    { label: '15% Discount', color: '#FF33A1' },
    { label: 'Free Shipping', color: '#FFD700' },
    { label: '20% Discount', color: '#33A1FF' },
    { label: 'Free Shipping', color: '#FFD700' },
    { label: 'Free Gift', color: '#F0A1FF' },
    { label: 'Free Shipping', color: '#FFD700' }
  ];
  segmentAngle = 360 / this.segments.length;

// In spin-wheel.component.ts
ngOnInit() {
  this.rewardSelected.subscribe(reward => {
    console.log('Reward emitted:', reward);
  });
}
  // Spin the wheel
 // In your spinWheel() method, update the GSAP animation:
spinWheel() {
  if (this.isSpinning) return;

  this.isSpinning = true;
  const randomSpin = Math.floor(Math.random() * 360) + 720;
  const targetAngle = this.currentAngle + randomSpin;

  // Get wheel element once at start
  const wheel = document.querySelector('.wheel') as HTMLElement;
  
  gsap.to(wheel, {  // Now animating the wheel element directly
    duration: 3,
    rotation: targetAngle,
    ease: 'power3.out',
    onComplete: () => {
      this.currentAngle = targetAngle % 360;
      this.isSpinning = false;
      this.showReward();
    }
  });
}

showReward() {
  const segmentIndex = Math.floor((360 - (this.currentAngle % 360)) / this.segmentAngle) % this.segments.length;
  const reward = this.segments[segmentIndex];
  
  this.rewardType = reward.label;
  this.rewardMessage = reward.label === 'No Reward' 
    ? 'Uh-oh! Better luck next time!' 
    : `You won ${reward.label}!`;
  
  // Show modal first
  this.showRewardModal = true;
  
  // Then emit the reward
  this.rewardSelected.emit(reward.label);
}

onModalClose() {
  this.showRewardModal = false;
  this.closeWheel.emit();  // Emit this instead of setting showWheel
}

  // Calculate label positions based on segment angle
  getLabelPosition(index: number): { transform: string } {
    const angle = this.segmentAngle * index; // Get the angle of this label
    const rotateDeg = `rotate(${angle}deg)`;
    const translateY = 'translateY(-120px)'; // Adjust this value to position the label outside the wheel
    return {
      transform: `${rotateDeg} ${translateY} rotate(${ -angle }deg)`, // Rotate and translate the label to position it correctly
    };
  }
}
