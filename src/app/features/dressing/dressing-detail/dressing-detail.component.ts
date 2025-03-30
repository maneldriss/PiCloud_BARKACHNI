import {Component, OnInit} from '@angular/core';
import {Dressing} from "../../../core/models/dressing.model";
import {Outfit} from "../../../core/models/outfit.model";
import {DressingService} from "../../../core/services/dressing.service";
import {OutfitService} from "../../../core/services/outfit.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-dressing-detail',
  templateUrl: './dressing-detail.component.html',
  styleUrls: ['./dressing-detail.component.css']
})
export class DressingDetailComponent implements OnInit {
  dressing?: Dressing;
  dressingForm!: FormGroup;
  outfits: Outfit[] = [];
  isEditing = false;

  constructor(
    private dressingService: DressingService,
    private outfitService: OutfitService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadDressing();
    this.loadOutfits();
  }

  initForm(): void {
    this.dressingForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  loadDressing(): void {
    this.dressingService.getDressing().subscribe(dressing => {
      this.dressing = dressing;
      this.dressingForm.patchValue({
        name: dressing.name
      });
    });
  }

  loadOutfits(): void {
    this.outfitService.getOutfits().subscribe(outfits => {
      this.outfits = outfits;
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.dressingForm.patchValue({
        name: this.dressing?.name
      });
    }
  }

  saveDressing(): void {
    if (this.dressingForm.invalid) {
      return;
    }

    const updatedDressing: Dressing = {
      ...this.dressing,
      name: this.dressingForm.value.name
    };

    this.dressingService.updateDressing(updatedDressing).subscribe(result => {
      this.dressing = result;
      this.isEditing = false;
      this.snackBar.open('Wardrobe updated successfully', 'Close', {
        duration: 3000
      });
    });
  }
}
