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
    name: string;
    logo: string;  // Add this
    // Add other brand properties if needed
  };
  AdStatus?: AdStatus;
  deleted?: boolean; // Add this to match backend

}

export enum AdStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}