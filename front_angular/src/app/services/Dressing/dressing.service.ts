import { Injectable } from '@angular/core';
import {of} from "rxjs";
import {Dressing} from "../../models/Dressing/dressing.model";

@Injectable({
  providedIn: 'root'
})
export class DressingService {

  private dressing: Dressing = {
    id: 1,
    name: 'My Wardrobe'
  };

  constructor() { }

  getDressing(){
    return of(this.dressing);
  }

  updateDressing(dressing: Dressing) {
    this.dressing = dressing;
    return of(this.dressing);
  }
}
