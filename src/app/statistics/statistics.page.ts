import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      labels: {
        padding: 10
      },
      position: 'bottom',
      
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = ['Food', 'Home', 'Transportation', 'Gas'];
  public pieChartData: number[] = [300, 500, 100, 400];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['#3498DB', '#FFC300', '#28B463', '#C70039', '#F5B7B1', '#9B59B6', '#196F3D', '#CD6155', '#F7DC6F', '#283747'],
    },
  ];
  
  constructor() { }

  ngOnInit() {
  }

}
