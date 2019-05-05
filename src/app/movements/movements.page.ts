import { Component, OnInit } from '@angular/core';
import { Movement } from './movement.model';
import { MovementType } from './movement-type.enum';
import { Category } from './categories/category.model';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.page.html',
  styleUrls: ['./movements.page.scss'],
})
export class MovementsPage implements OnInit {

  movements: Movement[] = [new Movement('id1', 'accountId1', MovementType.EXPENSE,
  new Category('categoryId1', 'compras', 'urlIcon1'), 'didu', 6, new Date())];
  
  constructor() { }

  ngOnInit() {
  }

}
