import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AccountsService } from '../accounts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.page.html',
  styleUrls: ['./new-account.page.scss'],
})
export class NewAccountPage implements OnInit {

  form: FormGroup;

  constructor(private loadingCtrl: LoadingController, private accountsService: AccountsService, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      balance: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      })
    });
  }

  onCreateAccount() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Creating account...'
      })
      .then(loadingElement => {
        loadingElement.present();
        console.log(this.form);
        this.accountsService
          .addAccount(
            this.form.value.name,
            this.form.value.balance
          )
          .subscribe(() => {
            loadingElement.dismiss();
            this.form.reset();
            this.router.navigate(['/home']);
          });
      });
  }

}
