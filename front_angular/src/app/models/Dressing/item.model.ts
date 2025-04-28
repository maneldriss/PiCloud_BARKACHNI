import {User} from "./user.model";
import {Category} from "./category.enum";
import {Outfit} from "./outfit.model";

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
  outfits?: Outfit[];
}
