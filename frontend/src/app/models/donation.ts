// models/donation.ts
export enum DonationType {
  MONEY = 'MONEY',
  CLOTHING = 'CLOTHING'
}

export enum DonationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Donation {
  donationId: number; // Rendre optionnel
  donationType: DonationType | string;
  amount?: number;

  itemDressing?: {
    itemID: number;
    itemName: string;
    imageUrl: string;
    description: string;
    condition: string;
    category: string;
    size?: string;
  };
  donor?: any;
  status?: DonationStatus | string;
}