import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Category} from "../../../core/models/category.enum";
import {ItemService} from "../../../core/services/item.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Item} from "../../../core/models/item.model";

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit {
  itemForm!: FormGroup;
  categories = Object.values(Category);
  isEditMode = false;
  itemId?: number;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.itemId = +params['id'];
        this.loadItem(this.itemId);
      }
    });
  }

  initForm(): void {
    this.itemForm = this.fb.group({
      itemName: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.maxLength(500)],
      category: ['', Validators.required],
      color: ['', Validators.required],
      size: ['', Validators.required],
      brand: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.maxLength(1000)]
    });
  }

  loadItem(id: number): void {
    this.itemService.getItemById(id).subscribe(item => {
      if (item) {
        this.itemForm.patchValue(item);
      }
    });
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      return;
    }

    const item: Item = this.itemForm.value;

    if (this.isEditMode && this.itemId) {
      item.itemID = this.itemId;
      this.itemService.updateItem(item).subscribe(() => {
        this.router.navigate(['/items']);
      });
    } else {
      this.itemService.addItem(item).subscribe(() => {
        this.router.navigate(['/items']);
      });
    }
  }

}
