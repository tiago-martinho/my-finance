import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  account = {};

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

  onChartClick(event) {
    console.log(event);
  }

  constructor() {}

  ngOnInit() {
    

  }

}
