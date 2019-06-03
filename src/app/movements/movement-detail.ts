import {  OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MovementsService } from './movements.service';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { CategoriesModal } from './categories/categories.modal';
import { Category } from './categories/category.model';

export class MovementDetail implements OnInit {
  form: FormGroup;
  category: Category = new Category(null, null, null);
  currentDate = new Date();

  constructor(
    protected movementsService: MovementsService,
    protected router: Router,
    protected loadingCtrl: LoadingController,
    protected modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
    console.log('parent init');
    this.form = new FormGroup({
      type: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      category: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      value: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.min(1)]
      }),
      date: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  onPickCategory() {
    console.log('opening category modal');
    this.modalCtrl
      .create({
        component: CategoriesModal
      })
      .then(modalElement => {
        modalElement.present();
        return modalElement.onDidDismiss();
      })
      .then(resultData => {
        if (resultData.role === 'confirm') {
          this.category = resultData.data.categoryData.pickedCategory;
          this.form.controls['category'].setValue(this.category.name);
        }
      });
  }
}
