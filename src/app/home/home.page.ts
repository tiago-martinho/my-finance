import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AccountsService } from '../accounts/accounts.service';
import { Router } from '@angular/router';
import { BankAccount } from '../accounts/bank-account.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  accounts: BankAccount[];
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

  constructor(private accountsService: AccountsService, private router: Router) {}

  ngOnInit() {
    this.accountsSub = this.accountsService.accounts.subscribe(accounts => {
      this.accounts = accounts;
    });
  }

  onAccountClick() {
    console.log('clicked');
    this.accountsService.updateAccountBalance().subscribe();
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.accountsService.getAccounts().subscribe(() => {
      this.isLoading = false;
    });
  }

  onChartClick(event) {
    console.log(event);
  }

  ngOnDestroy() {
    if (this.accountsSub) {
      this.accountsSub.unsubscribe();
    }
  }

  

}
