import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, of} from "rxjs";

export interface ColorResponse {
  name: {
    value: string;
    closest_named_hex: string;
    exact_match_name: boolean;
    distance: number;
  };
  hex: {
    value: string;
    clean: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private apiUrl = 'https://www.thecolorapi.com/id';
  private colorMap: Map<string, string> = new Map();

  constructor(private http: HttpClient) { }

  getColorName(hexColor: string) {
    const cleanHex = hexColor.replace('#', '');

    return this.http.get<ColorResponse>(`${this.apiUrl}?hex=${cleanHex}`)
      .pipe(
        map(response => {
          if (response && response.name && response.hex) {
            this.colorMap.set(response.name.value.toLowerCase(), '#' + response.hex.clean);
          }
          return response;
        }),
        catchError(error => {
          console.error('Error fetching color name:', error);
          return of(null);
        })
      );
  }

  getHexFromName(colorName: string): string | null {
    return this.colorMap.get(colorName.toLowerCase()) || null;
  }

  hexToRgb(hex: string): { r: number, g: number, b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  getContrastColor(hexColor: string): string {
    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return '#000000';

    const luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
    return luminance > 128 ? '#000000' : '#FFFFFF';
  }
}
