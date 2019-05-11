import { Component, OnInit, ViewChild } from '@angular/core';
import { BankAccount } from '../accounts/UserAccount.model';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  account = new BankAccount('id1', 'uid1', 'TestAcc1', 10000, null);

  chartOptions = {
    responsive: true,
    fill: false
  };

  chartData = [
    { data: [330, 600, 260, 700],  fill: false }
  ];

  chartLabels = ['January', 'February', 'March', 'April'];

  myColors = [
    {
      borderColor: '#406dff',
      pointBackgroundColor: '#406dff',
      pointBorderColor: '#406dff',
      pointHoverBackgroundColor: '#406dff',
      pointHoverBorderColor: '#fffff'
    },
    // ...colors for additional data sets
  ];

  onChartClick(event) {
    console.log(event);
  }

  constructor() {}

  ngOnInit() {

  }

}
