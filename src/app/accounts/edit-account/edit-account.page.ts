import { Component, OnInit } from '@angular/core';
import { AccountDetail } from '../account-detail';
import {
  LoadingController,
  AlertController,
  NavController
} from '@ionic/angular';
import { AccountsService } from '../accounts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MovementsService } from 'src/app/movements/movements.service';
import { Subscription } from 'rxjs';
import { BankAccount } from '../bank-account.model';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.page.html',
  styleUrls: ['./edit-account.page.scss']
})
export class EditAccountPage extends AccountDetail implements OnInit {
  accountId: string;
  userId: string;
  isLoading = false;
  private accountSub: Subscription;

  constructor(
    protected loadingCtrl: LoadingController,
    protected accountsService: AccountsService,
    protected router: Router,
    private alertCtrl: AlertController,
    private movementsService: MovementsService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) {
    super(loadingCtrl, accountsService, router);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('accountId')) {
        this.navCtrl.navigateBack('/home');
        return;
      }
      this.isLoading = true;
      this.accountSub = this.accountsService
        .getAccount(paramMap.get('accountId'))
        .subscribe(
          account => {
            this.accountId = account.id;
            this.userId = account.userId;
            this.setFormValues(account);
            this.isLoading = false;
          },
          error => {
            this.alertCtrl
              .create({
                header: 'An error ocurred!',
                message: 'Could not load account.',
                buttons: [
                  {
                    text: 'Ok',
                    handler: () => {
                      this.router.navigate(['/home']);
                    }
                  }
                ]
              })
              .then(alertElement => {
                alertElement.present();
              });
          }
        );
    });
    super.ngOnInit();
  }

  setFormValues(account: BankAccount) {
    this.form.get('name').setValue(account.name);
    this.form.get('balance').setValue(account.balance);
  }

  onEditAccount() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Updating account...'
      })
      .then(loadingElement => {
        loadingElement.present();
        this.accountsService
          .updateAccount(
            this.accountId,
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

  async onDeleteAccount() {
    await this.alertCtrl
      .create({
        header: 'Delete Account',
        message:
          'Are you sure you want to delete this account?',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              console.log('canceled');
            }
          },
          {
            text: 'Delete',
            handler: () => {
              this.loadingCtrl
                .create({ message: 'Deleting account...' })
                .then(loadingElement => {
                  loadingElement.present();
                  this.accountsService
                    .deleteAccount(this.accountId)
                    .subscribe(() => {
                      console.log('account deleted');
                      loadingElement.dismiss();
                      this.router.navigate(['/home']);
                    });
                });
            }
          }
        ]
      })
      .then(alertElement => {
        alertElement.present();
      });
  }
}
