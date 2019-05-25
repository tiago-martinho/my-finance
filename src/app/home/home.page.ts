import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { AccountsService } from '../accounts/accounts.service';
import { Router } from '@angular/router';
import { BankAccount } from '../accounts/bank-account.model';
import { Subscription } from 'rxjs';
import { AlertController, IonItem } from '@ionic/angular';
import { MovementsService } from '../movements/movements.service';
import { Movement } from '../movements/movement.model';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage
  implements OnInit, OnDestroy {

  accounts: BankAccount[] = [];
  selectedAccount: BankAccount;
  latestValues: number[] = [];
  chartLabels: string[] = [];
  isLoading = false;
  private accountsSub: Subscription;

  chartOptions = {
    responsive: true,
    fill: false
  };

  //change with movements data
  chartData = [{ data: this.latestValues, fill: false }];

  myColors = [
    {
      borderColor: '#406dff',
      pointBackgroundColor: '#406dff',
      pointBorderColor: '#406dff',
      pointHoverBackgroundColor: '#406dff',
      pointHoverBorderColor: '#fffff'
    }
  ];

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  
  constructor(
    private accountsService: AccountsService,
    private router: Router,
    private alertCtrl: AlertController,
    private movementsService: MovementsService
  ) {}

  ngOnInit() {
    this.accountsSub = this.accountsService.accounts.subscribe(accounts => {
      if (accounts.length > 0) {
        // sets the first account as default if one is not set currently
        const currentAccount = this.accountsService.getCurrentAccount();
        if (currentAccount === null) {
          this.accountsService.setCurrentAccount(accounts[0]);
          this.selectedAccount = accounts[0];
        } else {
          this.selectedAccount = currentAccount;
        }
        this.accounts = accounts;
        this.getLatestMovements();
      }
    });
  }

  // objects are never equal since they're two different instances so comparison of their stringfied versions is made
  compareAccounts(account: BankAccount) {
    return (JSON.stringify(account) === JSON.stringify(this.selectedAccount));
  }

  private setChartData(latestMovements: Movement[]) {
    // reset previously set values
    this.chartLabels = [];
    this.chartData = [];
    this.latestValues = [];

    // sort movements by date
    latestMovements.sort(function(m1, m2) {
      return m1.date.getTime() - m2.date.getTime();
    });

    //push movement dates into labels and movement values into values
    latestMovements.forEach(movement => {
      this.latestValues.push(movement.value);
      this.chartLabels.push(this.getTwoDigitDateFormat(movement.date.getDate()) + '-'
      + this.getTwoDigitDateFormat(movement.date.getMonth()));
    });

    this.chartData = [{ data: this.latestValues, fill: false }];
    // this.chart.update();
  }

  getTwoDigitDateFormat(dayOrMonth) {
    return (dayOrMonth < 10) ? '0' + dayOrMonth : '' + dayOrMonth;
  }

  //latest movements, from 30 days ago to the present
  async getLatestMovements() {
    const currentDate = new Date();
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 30);
    let latestMovements: Movement[] = [];

    await this.movementsService.getMovements().subscribe(movements => {
      latestMovements = movements.filter(
        (movement: Movement) =>
          movement.date >= pastDate && movement.date <= currentDate
      );
      this.setChartData(latestMovements);
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.accountsService.getAccounts().subscribe(() => {
      this.isLoading = false;
    });
  }

  onAccountSelect(account: BankAccount, item: IonItem) { 
      this.accountsService.setCurrentAccount(account);
      this.selectedAccount = account;
      this.getLatestMovements();
  }


  onEditAccount() {
    this.router.navigateByUrl('/edit-account/' + this.selectedAccount.id);
  }

  async onNewAccount() {
    if (this.accounts.length >= 3) {
      await this.alertCtrl
        .create({
          header: 'No more accounts are allowed',
          message:
            'You can only have up to 3 bank accounts associated with your user account.',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                console.log('canceled');
              }
            }
          ]
        })
        .then(alertElement => {
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
