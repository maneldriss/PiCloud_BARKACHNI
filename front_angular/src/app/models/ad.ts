export interface Ad {
  id?: number;
  title: string;
  description?: string;
  image?: string;
  link: string;
  expDate: string;
  nbClicks?: number;
  brand?: { 
    id: number;
    name: string;  // Add this
    // Add other brand properties if needed
  };
  AdStatus?: AdStatus;
}

export enum AdStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}