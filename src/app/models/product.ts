import { User } from "./user";

export interface Product {
  productId?: number;
  nameProduct: string;
  categoryProduct?: string;
  genderProduct?: string;
  productSize?:string;
  productSeller?: User;
  dateProductAdded?: Date;
  productImageURL?: string;
  productDescription?: string;
  productPrice?: number;
  productState?: string;

  reserved?: boolean;
  reservedBy?: User | null;
  reservationExpiry?: string | null;

}
