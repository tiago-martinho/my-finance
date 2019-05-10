import { Component, OnInit } from '@angular/core';
import { Movement } from './movement.model';
import { Router } from '@angular/router';
import { MovementsService } from './movements.service';
import * as _ from 'lodash';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.page.html',
  styleUrls: ['./movements.page.scss'],
})
export class MovementsPage implements OnInit {

  movementsMatrix: Movement[][] = [];
  isLoading = false;

  constructor(private router: Router, private movementsService: MovementsService) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.getMovements();
    
  }

  onNewMovement() {
    this.router.navigateByUrl('new-movement');
  }

  getMovements() {
    this.movementsService.getMovements().subscribe((res: Movement[]) => {
      if (res.length !== 0) {
        this.groupMovements(res);
      }
      this.isLoading = false;
    });
  }

  onEdit(movementId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'new-movements', movementId]);
    console.log('Editing item ' + movementId);
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
      return a[7] > b[7] ? 1 : -1;
    }));

    console.log(this.movementsMatrix);
  }   
}
