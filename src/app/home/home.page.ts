import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AccountsService } from '../accounts/accounts.service';
import { Router } from '@angular/router';
import { BankAccount } from '../accounts/bank-account.model';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  accounts: BankAccount[] = [];
  selectedAccount: BankAccount;
  isLoading = false;
  private accountsSub: Subscription;

  chartOptions = {
    responsive: true,
    fill: false
  };

  //change with movements data
  chartData = [
    { data: [330, 600, 260, 700],  fill: false }
  ];

  //change (last 30 days)
  chartLabels = ['January', 'February', 'March', 'April'];


  myColors = [
    {
      borderColor: '#406dff',
      pointBackgroundColor: '#406dff',
      pointBorderColor: '#406dff',
      pointHoverBackgroundColor: '#406dff',
      pointHoverBorderColor: '#fffff'
    },
  ];

  constructor(private accountsService: AccountsService, private router: Router, private alertCtrl: AlertController) {}

  ngOnInit() {
    this.accountsSub = this.accountsService.accounts.subscribe(accounts => {
      if (accounts.length > 0) {
        // sets the first account as default
        this.accountsService.setCurrentAccount(accounts[0]);
        this.selectedAccount = accounts[0];
        this.accounts = accounts;
      }
    });
  }

  onAccountSelect(account: BankAccount) {
    this.accountsService.setCurrentAccount(account);
    this.selectedAccount = account;
    console.log(this.accountsService.getCurrentAccount());
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.accountsService.getAccounts().subscribe(() => {
      this.isLoading = false;
    });
  }

  onEditAccount() {
    this.router.navigateByUrl('/edit-account/' + this.selectedAccount.id);
  }

  onChartClick(event) {
    console.log(event);
  }

  async onNewAccount() {
    if (this.accounts.length >= 3) {
      await this.alertCtrl.create({
        header: 'No more accounts are allowed',
        message: 'You can only have up to 3 bank accounts associated with your user account.',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              console.log('canceled');
            }
          },
        ]
      }).then(alertElement => {
        alertElement.present();
      });
    } else {
      this.router.navigateByUrl('new-account');
    }
  }

  ngOnDestroy() {
    if (this.accountsSub) {
      this.accountsSub.unsubscribe();
    }
  }

}
