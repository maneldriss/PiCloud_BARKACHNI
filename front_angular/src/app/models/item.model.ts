import { Category } from "./category.enum";
import { User } from "./user";

export interface Item {
  itemID?: number;
  itemName: string;
  description?: string;
  category: Category;
  size: string;
  color: string;
  brand: string;
  imageUrl?: string;
  dateAdded?: Date;
  user?: User;
  favorite?: boolean;
}
