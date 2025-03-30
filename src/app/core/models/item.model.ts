import {User} from "./user.model";
import {Category} from "./category.enum";

export interface Item {
  itemID?: number;
  itemName: string;
  description?: string;
  category: Category;
  color: string;
  size: string;
  brand: string;
  price: number;
  imageUrl?: string;
  dateAdded?: Date;
  user?: User;
}
