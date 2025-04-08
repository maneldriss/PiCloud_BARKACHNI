// item-dressing.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemDressing } from '../models/item-dressing';

@Injectable({
  providedIn: 'root'
})
export class ItemDressingService {
  private apiUrl = 'http://localhost:8089/BarkachniPI/itemDressing';

  constructor(private http: HttpClient) { }

  getAvailableItems(): Observable<ItemDressing[]> {
    return this.http.get<ItemDressing[]>(`${this.apiUrl}/retrieve-all-items`);
  }
}