import { Component, OnInit } from '@angular/core';
import { Movement } from './movement.model';
import { MovementType } from './movement-type.enum';
import { Category } from './categories/category.model';
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
    this.movements = this.movementsService.getMovements();
  }

  onNewMovement() {
    this.router.navigateByUrl('new-movement');
  }

}
