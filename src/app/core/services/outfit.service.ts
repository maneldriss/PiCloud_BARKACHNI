import { Injectable } from '@angular/core';
import {Outfit} from "../models/outfit.model";
import {of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OutfitService {

  private outfits: Outfit[] = [
    {
      outfitID: 1,
      name: 'Casual Friday',
      description: 'Comfortable outfit for casual Fridays at work',
      season: 'Fall',
      occasion: 'Work'
    },
    {
      outfitID: 2,
      name: 'Night Out',
      description: 'Stylish outfit for a night out with friends',
      season: 'Summer',
      occasion: 'Evening'
    },
    {
      outfitID: 3,
      name: 'Weekend Brunch',
      description: 'Relaxed outfit for weekend brunches',
      season: 'Spring',
      occasion: 'Casual'
    },
    {
      outfitID: 4,
      name: 'Winter Formal',
      description: 'Elegant outfit for winter formal events',
      season: 'Winter',
      occasion: 'Formal'
    }
  ];

  constructor() {
  }

  getOutfits() {
    return of(this.outfits);
  }

  getOutfitById(id: number) {
    const outfit = this.outfits.find(o => o.outfitID === id);
    return of(outfit);
  }

  addOutfit(outfit: Outfit) {
    const newOutfit = {
      ...outfit,
      outfitID: this.outfits.length + 1
    };
    this.outfits.push(newOutfit);
    return of(newOutfit);
  }

  updateOutfit(outfit: Outfit) {
    const index = this.outfits.findIndex(o => o.outfitID === outfit.outfitID);
    if (index !== -1) {
      this.outfits[index] = outfit;
      return of(outfit);
    }
    return of(outfit);
  }

  deleteOutfit(id: number) {
    const index = this.outfits.findIndex(o => o.outfitID === id);
    if (index !== -1) {
      this.outfits.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
