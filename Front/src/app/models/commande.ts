import { Cart } from './cart';
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
}


export { Cart };
