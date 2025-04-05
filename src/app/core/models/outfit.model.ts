import {Item} from "./item.model";
import {Dressing} from "./dressing.model";

export interface Outfit {
  outfitID?: number;
  name: string;
  description?: string;
  items?: Item[];
  dressing?: Dressing;
  season?: string;
  occasion?: string;
}
