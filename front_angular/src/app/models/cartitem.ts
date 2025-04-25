import { Product } from './product';

export interface CartItem {
  itemID: number;
  name: string;
  quantity: number;
  product: Product;
}
