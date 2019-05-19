import { Injectable } from '@angular/core';
import { Movement } from './movement.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { take, tap, switchMap, map, catchError } from 'rxjs/operators';
import { Category } from './categories/category.model';
import { AccountsService } from '../accounts/accounts.service';
import { AuthService } from '../auth/auth.service';
import { Plugins } from '@capacitor/core';
import { BankAccount } from '../accounts/bank-account.model';

interface MovementData {
  accountId: string;
  categoryId: string;
  categoryName: string;
  date: Date;
  description: string;
  isExpense: boolean;
  value: number;
}

interface CategoryData {
  categoryName: string;
  iconUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovementsService {
  private baseUrl = 'https://myfinance-daam.firebaseio.com/';
  private movementsUrl = this.baseUrl + 'movements';
  private categoriesUrl = this.baseUrl + 'categories';

  private _movements = new BehaviorSubject<Movement[]>([]);
  private _categories = new BehaviorSubject<Category[]>([]);

  get movements() {
    return this._movements.asObservable();
  }

  get categories() {
    return this._categories.asObservable();
  }

  constructor(
    private http: HttpClient,
    private accountsService: AccountsService,
    private auth: AuthService
  ) {
  }

  addMovement(
    isExpense: boolean,
    description: string,
    categoryId: string,
    categoryName: string,
    value: number,
    date: Date
  ) {
    let generatedId: string;
    let fetchedUserId: string;

    const newMovement = new Movement();
    newMovement.accountId = this.accountsService.getCurrentAccount().id;
    newMovement.isExpense = isExpense;
    newMovement.description = description;
    newMovement.categoryId = categoryId;
    newMovement.categoryName = categoryName;
    newMovement.value = value;
    newMovement.date = date;

    return this.auth.userId.pipe(
      take(1),
      switchMap(userId => {
        fetchedUserId = userId;
        return this.auth.token;
      }),
      take(1),
      switchMap(token => {
        if (!fetchedUserId) {
          throw new Error('No user found!');
        }
        return this.http
          .post<{ name: string }>(`${this.movementsUrl}.json?auth=${token}`, {
            ...newMovement,
            id: null
          })
          .pipe(
            switchMap(response => {
              generatedId = response.name;
              this.accountsService.updateAccountBalanceOnAddOrDelete(
                isExpense,
                false,
                value
              );
              return this.movements;
            }),
            take(1),
            tap(movements => {
              newMovement.id = generatedId;
              this._movements.next(movements.concat(newMovement));
            })
          );
      })
    );
  }

  updateMovement(
    id: string,
    categoryId: string,
    categoryName: string,
    description: string,
    isExpense: boolean,
    value: number,
    date: Date
  ) {
    let updatedMovements: Movement[];
    let oldMovement: Movement;
    let fetchedToken: string;
    const newMovement: Movement = new Movement();

    return this.auth.token.pipe(
      take(1),
      switchMap(token => {
        fetchedToken = token;
        return this.movements;
      }),
      take(1),
      switchMap(movements => {
        if (!movements || movements.length <= 0) {
          return this.getMovements();
        } else {
          return of(movements);
        }
      }),
      switchMap(movements => {
        const updatedMovementIndex = movements.findIndex(m => m.id === id);
        updatedMovements = [...movements];
        oldMovement = updatedMovements[updatedMovementIndex];
        newMovement.id = oldMovement.id;
        newMovement.accountId = oldMovement.accountId;
        newMovement.categoryId = categoryId;
        newMovement.categoryName = categoryName;
        newMovement.description = description;
        newMovement.isExpense = isExpense;
        newMovement.value = value;
        newMovement.date = date;
        updatedMovements[updatedMovementIndex] = newMovement;
        return this.http.put(
          `${this.movementsUrl}/${id}.json?auth=${fetchedToken}`,
          {
            ...updatedMovements[updatedMovementIndex],
            id: null
          }
        );
      }),
      tap(() => {
        this.accountsService.updateAccountBalanceOnEdit(
          oldMovement,
          newMovement
        );
        this._movements.next(updatedMovements);
      })
    );
  }

  deleteMovement(id: string, isExpense: boolean, value: number) {
    return this.auth.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.delete(
          `${this.movementsUrl}/${id}.json?auth=${token}`
        );
      }),
      switchMap(() => {
        this.accountsService.updateAccountBalanceOnAddOrDelete(
          isExpense,
          true,
          value
        );
        return this.movements;
      }),
      take(1),
      tap(movements => {
        this._movements.next(movements.filter(m => m.id !== id));
      })
    );
  }

  getMovements() {
    let fetchedUserId: string;
    const currentAccount = this.accountsService.getCurrentAccount();
    console.log(currentAccount);

    return this.auth.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not found!');
        }
        if (!currentAccount) {
          throw new Error('Account not found!');
        }
        fetchedUserId = userId;
        return this.auth.token;
      }),
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: MovementData }>(
          `${this.movementsUrl}.json?orderBy="accountId"&equalTo="${currentAccount.id}"&auth=${token}`
        );
      }),
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
            movements.push(newMovement);
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
    return this.auth.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get<MovementData>(
          `${this.movementsUrl}/${id}.json?auth=${token}`
        );
      }),
      map(response => {
        const newMovement = new Movement();
        newMovement.id = id;
        newMovement.accountId = response.accountId;
        newMovement.isExpense = response.isExpense;
        newMovement.categoryId = response.categoryId;
        newMovement.categoryName = response.categoryName;
        newMovement.description = response.description;
        newMovement.value = response.value;
        newMovement.date = new Date(response.date);
        return newMovement;
      })
    );
  }

  getMovementCategories() {
    return this.auth.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: CategoryData }>(
          `${this.categoriesUrl}.json?auth=${token}`
        );
      }),
      map(response => {
        const categories = [];
        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            categories.push(
              new Category(
                key,
                response[key].categoryName,
                response[key].iconUrl
              )
            );
          }
        }
        return categories;
      }),
      tap(categories => {
        this._categories.next(categories);
      })
    );
  }
}
