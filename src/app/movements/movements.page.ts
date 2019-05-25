import { Component, OnInit, OnDestroy } from '@angular/core';
import { Movement } from './movement.model';
import { Router } from '@angular/router';
import { MovementsService } from './movements.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.page.html',
  styleUrls: ['./movements.page.scss']
})
export class MovementsPage implements OnInit, OnDestroy {
  private movementsSub: Subscription;
  movements: Movement[];
  movementsMatrix: Movement[][] = [];
  backupMovements: Movement[][] = [];
  isLoading = false;

  constructor(
    private router: Router,
    private movementsService: MovementsService
  ) {}

  ngOnInit() {
    this.movementsSub = this.movementsService.movements.subscribe(movements => {
      this.movements = movements;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.movementsService.getMovements().subscribe(
      (res: Movement[]) => {
        this.groupMovements(res);
        this.isLoading = false;
        this.backupMovements = this.movementsMatrix; // so we don't need to fetch the same data everytime a new search is made
      },
      error => {
        console.log(error);
        this.router.navigate(['home']);
      }
    );
  }

  onNewMovement() {
    this.router.navigateByUrl('movements/new-movement');
  }

  searchMovements(event) {
    console.log(event);
    this.isLoading = true;
    this.movements = _.flatten(this.movementsMatrix);
    if (event.target.value !== '') {
      this.movements = this.movements.filter(movement =>
        movement.description
          .toLocaleLowerCase()
          .includes(event.target.value.toLocaleLowerCase())
      );
      this.groupMovements(this.movements);
    }
    this.isLoading = false;
  }

  clearResults() {
    this.isLoading = true;
    if (this.backupMovements.length > 0) {
      this.movementsMatrix = this.backupMovements;
    }
    this.isLoading = false;
  }

  //This function groups and orders the movements by year-month in order to create headers in the list presented in the view
  groupMovements(movements: Movement[]) {
    this.movementsMatrix = [];

    if (movements.length === 0) {
      return;
    }

    //group by YYYY-MM
    const groups = _.groupBy(movements, function(item) {
      return item.date.toISOString().substring(0, 7);
    });

    // sort the movements of each group by date
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

      // push array to matrix
      this.movementsMatrix.push(group);
    }

    this.movementsMatrix = this.movementsMatrix.sort(function(a, b) {
      return a[0].date > b[0].date ? -1 : 1;
    });

    console.log('SORTED MATRIX ' + this.movementsMatrix);

    // //sort the arrays by date
    // this.movementsMatrix = this.movementsMatrix.sort((function(a, b) {
    //   return a[7] > b[7] ? 1 : -1;
    // }));
  }

  ngOnDestroy(): void {
    if (this.movementsSub) {
      this.movementsSub.unsubscribe();
    }
  }
}
