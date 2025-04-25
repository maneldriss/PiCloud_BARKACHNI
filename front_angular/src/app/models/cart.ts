import { User } from './user';
import { CartItem } from './cartitem';

export interface Cart {
  cartID: number;
  total: number;
  user: User;
  cartitems: CartItem[];
}
