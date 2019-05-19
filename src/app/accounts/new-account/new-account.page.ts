import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AccountsService } from '../accounts.service';
import { Router } from '@angular/router';
import { AccountDetail } from '../account-detail';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.page.html',
  styleUrls: ['./new-account.page.scss'],
})
export class NewAccountPage extends AccountDetail implements OnInit {

  constructor(protected loadingCtrl: LoadingController, protected accountsService: AccountsService, protected router: Router) {
    super(loadingCtrl, accountsService, router);
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
