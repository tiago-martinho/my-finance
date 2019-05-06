import { Injectable } from '@angular/core';
import { Movement } from './movement.model';
import { MovementType } from './movement-type.enum';
import { Category } from './categories/category.model';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { take, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovementsService {

  private _movements = new BehaviorSubject<Movement[]>([]);

  get movements() {
    return this._movements.asObservable();
  }

  // movements: Movement[] = [new Movement('id1', 'accountId1', MovementType.EXPENSE,
  // new Category('categoryId1', 'compras', 'urlIcon1'), 'didu', 6, new Date())];
  
  constructor(private http: HttpClient) { }

  addMovement(accountId: string, type: MovementType, description: string, category: Category, value: number, date: Date) {
    let generatedId: string;
    const newMovement = new Movement(
      Math.random().toString(),
      accountId,
      type,
      category,
      description,
      value,
      date
    );
    return this.http
      .post<{ name: string }>(
        'https://myfinance-daam.firebaseio.com/movements.json',
        { ...newMovement, id: null }
      )
      .pipe(
        switchMap(response => {
          generatedId = response.name;
          return this.movements;
        }),
        take(1),
        tap(movements => {
          newMovement.id = generatedId;
          this._movements.next(movements.concat(newMovement));
        })
      );
  }
  
  getMovements() {
    return this.movements;
  }
}
