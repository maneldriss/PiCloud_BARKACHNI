import { ItemDressing } from "./item-dressing";
import { User } from "./user";

export enum DonationType {
    MONEY = 'MONEY',
    CLOTHING = 'CLOTHING'
  }
  
  export interface Donation {
    donationId?: number;
    donationType: DonationType | string; // Accepte aussi les strings
    amount?: number;
    itemDressing?: any; // Temporairement
    donor?: any; // Temporairement
  }