import {  OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MovementsService } from './movements.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

export class MovementDetail implements OnInit {
  form: FormGroup;

  constructor(
    protected movementsService: MovementsService,
    protected router: Router,
    protected loadingCtrl: LoadingController
  ) {
    console.log('parent constructor')
  }

  ngOnInit() {
    console.log('parent init');
    this.form = new FormGroup({
      type: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      value: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      date: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onPickCategory() {
    console.log('opening category modal');
    
  }
}
