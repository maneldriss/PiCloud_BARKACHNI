import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(
    value: string, 
    limit: number = 100, 
    completeWords: boolean = false, 
    ellipsis: string = '...'
  ): string {
    // If no value or empty string, return empty string
    if (!value || value.length === 0) {
      return '';
    }

    // If value is shorter than limit, return as is
    if (value.length <= limit) {
      return value;
    }

    // If completeWords is true, find the last space before limit
    if (completeWords) {
      limit = value.substring(0, limit).lastIndexOf(' ');
      if (limit < 0) { // If no spaces found, just truncate
        limit = 100;
      }
    }

    // Return truncated string with ellipsis
    return `${value.substring(0, limit)}${ellipsis}`;
  }
}