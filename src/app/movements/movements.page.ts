import { Component, OnInit } from '@angular/core';
import { Movement } from './movement.model';
import { Router } from '@angular/router';
import { MovementsService } from './movements.service';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.page.html',
  styleUrls: ['./movements.page.scss'],
})
export class MovementsPage implements OnInit {

  movements: Movement[] = [];

  constructor(private router: Router, private movementsService: MovementsService) { }

  ngOnInit() {
    this.getMovements();
  }

  ionViewWillEnter() {
    this.getMovements();
  }

  onNewMovement() {
    this.router.navigateByUrl('new-movement');
  }

  getMovements() {
    this.movementsService.getMovements().subscribe((res: any[]) => {
      this.movements = res;
    });
  }



}
