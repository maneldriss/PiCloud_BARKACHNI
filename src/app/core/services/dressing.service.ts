import { Injectable } from '@angular/core';
import {Dressing} from "../models/dressing.model";
import {of} from "rxjs";

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
