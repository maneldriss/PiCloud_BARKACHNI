import { Product } from "./product";

export interface User {
    idUser?: number;
    nameUser?: string;
    products: Product;
  
}
