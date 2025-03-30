import {Dressing} from "./dressing.model";
import {Item} from "./item.model";

export interface User {
  userID: number;
  items?: Item[];
  dressing?: Dressing;
}
