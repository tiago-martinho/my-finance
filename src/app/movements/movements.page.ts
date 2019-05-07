import { Component, OnInit } from '@angular/core';
import { Movement } from './movement.model';
import { Router } from '@angular/router';
import { MovementsService } from './movements.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.page.html',
  styleUrls: ['./movements.page.scss'],
})
export class MovementsPage implements OnInit {

  movementsMatrix: Movement[][] = [];

  constructor(private router: Router, private movementsService: MovementsService) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.getMovements();
    console.log('called');
  }

  onNewMovement() {
    this.router.navigateByUrl('new-movement');
  }

  getMovements() {
    this.movementsService.getMovements().subscribe((res: Movement[]) => {
      this.groupMovements(res);
    });
  }

  //This function groups and orders the movements by year-month in order to create headers in the list presented in the view
  groupMovements(movements: Movement[]) {
    this.movementsMatrix = [];
    //group by YYYY-MM
    const groups = _.groupBy(movements, function(item) {
      return item.date.toISOString().substring(0, 7);
    });
    // sort each group by date
    // tslint:disable-next-line: forin
    for (const key in groups) {
      const group = groups[key].sort((n1, n2) => {
        if (n1.date > n2.date) {
          return -1;
        }

        if (n1 < n2) {
          return 1;
      }
  
      return 0;
      });
      //push array to matrix
      this.movementsMatrix.push(group);
    }

    //sort the arrays by date
    this.movementsMatrix = this.movementsMatrix.sort((function(a, b) { 
      return a[6] > b[6] ? 1 : -1;
    }));

    console.log(this.movementsMatrix);
  }   
}
