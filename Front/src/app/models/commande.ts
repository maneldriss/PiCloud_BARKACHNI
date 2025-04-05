import { Cart } from './cart';
import { User } from './user';

export interface Commande {
  commandeID: number;
cart:Cart;
  shippingAddress: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingMethod: string;
  shippingCost: number;
}

