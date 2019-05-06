import { Injectable } from '@angular/core';
import { Movement } from './movement.model';
import { MovementType } from './movement-type.enum';
import { Category } from './categories/category.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { take, tap, switchMap, map, catchError } from 'rxjs/operators';

interface MovementData {
  accountId: string;
  category: Category;
  date: Date;
  description: string;
  type: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class MovementsService {

  private movementsUrl = 'https://myfinance-daam.firebaseio.com/movements.json';

  private _movements = new BehaviorSubject<Movement[]>([]);

  get movements() {
    return this._movements.asObservable();
  }
  
  constructor(private http: HttpClient) { }

  addMovement(accountId: string, type: MovementType, description: string, category: Category, value: number, date: Date) {
    let generatedId: string;

    // if it's an expensive it should be a negative number
    if (type.toLocaleLowerCase === MovementType.EXPENSE.toLocaleLowerCase) {
      value = value * -1;
    }

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
        this.movementsUrl,
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
    return this.http
      .get<{ [key: string]: MovementData }>(
        this.movementsUrl
      )
      .pipe(
        map(response => {
          const movements = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              movements.push(
                new Movement(
                  key,
                  response[key].accountId,
                  response[key].type === MovementType.EXPENSE ? MovementType.EXPENSE : MovementType.INCOME,
                  response[key].category,
                  response[key].description,
                  response[key].value,
                  new Date(response[key].date),
                )
              );
            }
          }
          return movements;
        }),
        tap(movements => {
          this._movements.next(movements);
        })
      );
  }


}
