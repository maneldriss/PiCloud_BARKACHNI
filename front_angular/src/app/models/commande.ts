import { Cart } from './cart';
import { CartItem } from './cartitem';
import { User } from './user';

export interface Commande {
  commandeID: number | null;
  cart: Cart | null; 
  shippingAddress: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingMethod: string;
  shippingCost: number;
  commandeitems: CartItem[];
  total: number;
  user?: User | null; 
 
}


export { Cart };
