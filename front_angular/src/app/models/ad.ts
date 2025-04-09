import { Brand } from './brand';

export interface Ad {
  id?: number;
  title: string;
  description?: string;
  image?: string;
  link: string;
  expDate: Date;
  nbClicks: number;
  brand?: Brand;
}