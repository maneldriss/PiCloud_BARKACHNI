import { User } from "./user";

export interface Product {
  productId?: number;
  nameProduct: string;
  categoryProduct?: string;
  productSeller?: User;
  dateProductAdded?: Date;
  productImageURL?: string;
  productDescription?: string;
  productPrice?: number;
  productState?: string;

}
