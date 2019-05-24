import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { MovementsService } from '../movements/movements.service';
import { Movement } from '../movements/movement.model';
import * as _ from 'lodash';
import { AccountsService } from '../accounts/accounts.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss']
})
export class StatisticsPage implements OnInit {
  totalIncome = 0;
  totalExpenses = 0;
  dailyAverageIncome = 0;
  dailyAverageExpenses = 0;
  cashFlow = 0;

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      labels: {
        padding: 10
      },
      position: 'bottom'
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        }
      }
    }
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: [
        '#3498DB',
        '#FFC300',
        '#28B463',
        '#C70039',
        '#F5B7B1',
        '#9B59B6',
        '#196F3D',
        '#CD6155',
        '#F7DC6F',
        '#283747'
      ]
    }
  ];

  constructor(
    private movementsService: MovementsService,
    private accountsService: AccountsService
  ) {}

  ngOnInit() {
    this.getMovementsByTimeFrame('month');
  }

  onPeriodChange(event) {
    this.getMovementsByTimeFrame(event.detail.value);
  }

  async getMovementsByTimeFrame(option) {
    const currentDate = new Date();
    const pastDate = new Date();
    let days = 0; // this variable is needed to calculate the daily average income and expenses

    if (option === 'month') {
      pastDate.setDate(currentDate.getDate() - 30);
      days = 30;
    } else if (option === 'year') {
      pastDate.setDate(currentDate.getDate() - 365);
      days = 365;
    } else {
      // in this case the difference between present day and account creation date is used for daily average calculations
      const account = this.accountsService.getCurrentAccount();
      const accountDate = new Date(account.creationDate);
      pastDate.setDate(accountDate.getDate());
      days = currentDate.getDate() - pastDate.getDate();
    }

    let movements: Movement[] = [];

    await this.movementsService.getMovements().subscribe(response => {
      movements = response.filter(
        (movement: Movement) =>
          movement.date >= pastDate && movement.date <= currentDate
      );
      this.setChartData(movements);
      this.setTableData(movements, days);
    });
  }

  setChartData(movements) {
    // reset previously set values
    this.pieChartLabels = [];
    this.pieChartData = [];

    // group movements by category
    if (movements.length === 0) {
      return;
    }

    const groups = _.groupBy(movements, function(item) {
      return item.categoryName;
    });

    // tslint:disable-next-line: forin
    for (const key in groups) {
      let groupSum = 0;
      groups[key].forEach(function(movement) {
        groupSum += movement.value;
      });
      this.pieChartLabels.push(key);
      this.pieChartData.push(groupSum);
    }

    // this.chart.update();
  }

  setTableData(movements: Movement[], days: number) {
    this.totalExpenses = 0;
    this.totalIncome = 0;
    this.cashFlow = 0;
    this.dailyAverageIncome = 0;
    this.dailyAverageExpenses = 0;

    movements.forEach((movement: Movement) => {
      if (movement.isExpense) {
        this.totalExpenses += movement.value;
      } else {
        this.totalIncome += movement.value;
      }
    });

    this.cashFlow = this.totalIncome - this.totalExpenses;

    this.dailyAverageExpenses = this.totalExpenses / days;
    this.dailyAverageIncome = this.totalIncome / days;

    // limit decimal places
    this.totalExpenses = +this.totalExpenses.toFixed(2);
    this.totalIncome = +this.totalIncome.toFixed(2);
    this.cashFlow = +this.cashFlow.toFixed(2);
    this.dailyAverageIncome = +this.dailyAverageIncome.toFixed(2);
    this.dailyAverageExpenses = +this.dailyAverageExpenses.toFixed(2);
  }
}
