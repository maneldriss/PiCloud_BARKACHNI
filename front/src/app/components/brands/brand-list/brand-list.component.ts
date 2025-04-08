import { Component, OnInit } from '@angular/core';
import { Brand } from '../../../models/brand';
import { BrandService } from '../../../services/brand.service';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent implements OnInit {
  brands: Brand[] = [];
  loading = true;
  error = '';

  constructor(private brandService: BrandService) { }

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.loading = true;
    this.brandService.getAllBrands().subscribe({
      next: (data) => {
        this.brands = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load brands. Please try again later.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteBrand(id: number | undefined): void {
  if (!id) {
    this.error = 'Cannot delete brand with undefined ID.';
    return;
  }
  
  if (confirm('Are you sure you want to delete this brand?')) {
    this.brandService.deleteBrand(id).subscribe({
      next: () => {
        this.loadBrands();
      },
      error: (err) => {
        this.error = 'Failed to delete brand. Please try again later.';
        console.error(err);
      }
    });
  }
}
}