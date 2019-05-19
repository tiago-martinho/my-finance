import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AccountsService } from './accounts.service';
import { Router } from '@angular/router';

export class AccountDetail implements OnInit {
  form: FormGroup;

  constructor(
    protected loadingCtrl: LoadingController,
    protected accountsService: AccountsService,
    protected router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(15)]
      }),
      balance: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      })
    });
  }
}
