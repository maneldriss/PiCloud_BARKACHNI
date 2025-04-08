import { User } from './user';

export interface ItemDressing {
  itemID?: number;
  itemName?: string;
  description?: string;
  size?: string;
  gender?: string;
  category?: string;
  condition?: string;
  imageUrl?: string;
  user?: User;
}