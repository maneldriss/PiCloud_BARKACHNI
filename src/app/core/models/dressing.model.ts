import {Outfit} from "./outfit.model";
import {User} from "./user.model";

export interface Dressing {
  id?: number;
  name: string;
  user?: User;
  outfits?: Outfit[];
}
