import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-rewardmodal',
  templateUrl: './rewardmodal.component.html',
  styleUrls: ['./rewardmodal.component.css']
})
export class RewardmodalComponent {// Note: PascalCase
  @Input() isVisible: boolean = false;  // boolean type
  @Input() rewardMessage: string = '';  // string type
  @Output() close = new EventEmitter<void>();  // Event emitter

  rewardType = '';

  ngOnChanges() {
    if (this.rewardMessage.includes('Discount')) {
      this.rewardType = 'discount';
    } else if (this.rewardMessage.includes('Shipping')) {
      this.rewardType = 'shipping';
    } else if (this.rewardMessage.includes('Gift')) {
      this.rewardType = 'gift';
    } else {
      this.rewardType = 'none';
    }
  }

  onClose() {
    this.close.emit();
  }
}