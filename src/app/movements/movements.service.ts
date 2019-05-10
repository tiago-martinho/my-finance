import { Injectable } from '@angular/core';
import { Movement } from './movement.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { take, tap, switchMap, map, catchError } from 'rxjs/operators';

interface MovementData {
  accountId: string;
  categoryId: string;
  categoryName: string;
  date: Date;
  description: string;
  isExpense: boolean;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class MovementsService {

  private movementsUrl = 'https://myfinance-daam.firebaseio.com/movements';

  private _movements = new BehaviorSubject<Movement[]>([]);

  get movements() {
    return this._movements.asObservable();
  }
  
  constructor(private http: HttpClient) { }

  addMovement(accountId: string, isExpense: boolean, description: string, categoryId: string, categoryName: string, 
    value: number, date: Date) {
    let generatedId: string;

    const newMovement = new Movement();
    newMovement.accountId = accountId;
    newMovement.isExpense = isExpense;
    newMovement.description = description;
    newMovement.categoryId = categoryId;
    newMovement.categoryName = categoryName;
    newMovement.value = value;
    newMovement.date = date;
    
    return this.http
      .post<{ name: string }>(
        this.movementsUrl + '.json',
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
        this.movementsUrl + '.json'
      )
      .pipe(
        map(response => {
          const movements = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              const newMovement = new Movement();
              newMovement.id = key;
              newMovement.accountId = response[key].accountId;
              newMovement.isExpense = response[key].isExpense;
              newMovement.categoryId = response[key].categoryId;
              newMovement.categoryName = response[key].categoryName;
              newMovement.description = response[key].description;
              newMovement.value = response[key].value;
              newMovement.date = new Date(response[key].date);
              movements.push(
                newMovement
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

  getMovement(id: string) {
    return this.http
    .get<MovementData>(
      this.movementsUrl + `/${id}.json`
    )
    .pipe(
      map(response => {
        const newMovement = new Movement();
        newMovement.id = id;
        newMovement.accountId = response.accountId;
        newMovement.isExpense =response.isExpense;
        newMovement.categoryId = response.categoryId;
        newMovement.categoryName = response.categoryName;
        newMovement.description = response.description;
        newMovement.value = response.value;
        newMovement.date = new Date(response.date);
        return newMovement;
      })
    );
  }


}
