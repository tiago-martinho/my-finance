import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { BankAccount } from './bank-account.model';
import { switchMap, take, tap, map } from 'rxjs/operators';
import { BehaviorSubject, of, from } from 'rxjs';
import { Movement } from '../movements/movement.model';

interface AccountData {
  balance: number;
  name: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private accountsUrl = 'https://myfinance-daam.firebaseio.com/accounts';

  private _accounts = new BehaviorSubject<BankAccount[]>([]);

  get accounts() {
    return this._accounts.asObservable();
  }

  constructor(private http: HttpClient, private auth: AuthService) {}

  getCurrentAccount(): BankAccount {
    return JSON.parse(localStorage.getItem('currentAccount')) as BankAccount;
  }

  setCurrentAccount(account: BankAccount) {
    localStorage.setItem('currentAccount', JSON.stringify(account));
  }

  addAccount(name: string, balance: number) {
    let generatedId: string;
    let fetchedUserId: string;
    const newBankAccount = new BankAccount();

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
        newBankAccount.userId = fetchedUserId;
        newBankAccount.name = name;
        newBankAccount.balance = balance;
        return this.http
          .post<{ name: string }>(`${this.accountsUrl}.json?auth=${token}`, {
            ...newBankAccount,
            id: null
          })
          .pipe(
            switchMap(response => {
              generatedId = response.name;
              return this.accounts;
            }),
            take(1),
            tap(accounts => {
              newBankAccount.id = generatedId;
              this._accounts.next(accounts.concat(accounts));
            })
          );
      })
    );
  }

  getAccount(id: string) {
    return this.auth.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get<AccountData>(
          `${this.accountsUrl}/${id}.json?auth=${token}`
        );
      }),
      map(response => {
        const newAccount = new BankAccount();
        newAccount.id = id;
        newAccount.userId = response.userId;
        newAccount.name = response.name;
        newAccount.balance = response.balance;

        return newAccount;
      })
    );
  }

  getAccounts() {
    let fetchedUserId: string;
    return this.auth.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not found!');
        }
        fetchedUserId = userId;
        return this.auth.token;
      }),
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: AccountData }>(
          this.accountsUrl +
            `.json?orderBy="userId"&equalTo="${fetchedUserId}"&auth=${token}`
        );
      }),
      map(response => {
        const accounts = [];
        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            const newAccount = new BankAccount();
            newAccount.id = key;
            newAccount.userId = response[key].userId;
            newAccount.name = response[key].name;
            newAccount.balance = response[key].balance;
            accounts.push(newAccount);
          }
        }
        return accounts;
      }),
      tap(accounts => {
        this._accounts.next(accounts);
      })
    );
  }

  updateAccount(id: string, name: string, balance: number) {
    let updatedAccounts: BankAccount[];
    let oldAccount: BankAccount;
    let fetchedToken: string;
    const newAccount: BankAccount = new BankAccount();

    return this.auth.token.pipe(
      take(1),
      switchMap(token => {
        fetchedToken = token;
        return this.accounts;
      }),
      take(1),
      switchMap(accounts => {
        if (!accounts || accounts.length <= 0) {
          return this.getAccounts();
        } else {
          return of(accounts);
        }
      }),
      switchMap(accounts => {
        const updatedAccountIndex = accounts.findIndex(a => a.id === id);
        updatedAccounts = [...accounts];
        oldAccount = updatedAccounts[updatedAccountIndex];
        newAccount.id = oldAccount.id;
        newAccount.userId = oldAccount.userId;
        newAccount.name = name;
        newAccount.balance = balance;

        updatedAccounts[updatedAccountIndex] = newAccount;

        return this.http.put(
          `${this.accountsUrl}/${id}.json?auth=${fetchedToken}`,
          {
            ...updatedAccounts[updatedAccountIndex],
            id: null
          }
        );
      })
    );
  }

  deleteAccount(id: string) {
    return this.auth.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.delete(
          `${this.accountsUrl}/${id}.json?auth=${token}`
        );
      }),
      switchMap(() => {
        return this.accounts;
      }),
      take(1),
      tap(accounts => {
        this._accounts.next(accounts.filter(a => a.id !== id));
      })
    );
  }

  updateAccountBalanceOnAddOrDelete(
    isExpense: boolean,
    isDeletion: boolean,
    value: number
  ) {
    this.calculateAccountBalanceOnAddOrDelete(isExpense, isDeletion, value);
    this.updateAccountBalance().subscribe();
  }

  updateAccountBalanceOnEdit(oldMovement: Movement, newMovement: Movement) {
    this.calculateAccountBalanceOnEdit(oldMovement, newMovement);
    this.updateAccountBalance().subscribe();
  }

  private updateAccountBalance() {
    let updatedAccounts: BankAccount[];
    let fetchedToken: string;
    const currentAccount = this.getCurrentAccount();

    return this.auth.token.pipe(
      take(1),
      switchMap(token => {
        fetchedToken = token;
        return this.accounts;
      }),
      take(1),
      switchMap(accounts => {
        if (!accounts || accounts.length <= 0) {
          return this.getAccounts();
        } else {
          return of(accounts);
        }
      }),
      switchMap(accounts => {
        const updatedAccountIndex = accounts.findIndex(
          a => a.id === currentAccount.id
        );
        updatedAccounts = [...accounts];
        updatedAccounts[updatedAccountIndex] = currentAccount;
        return this.http.put(
          `${this.accountsUrl}/${currentAccount.id}.json?auth=${fetchedToken}`,
          { ...updatedAccounts[updatedAccountIndex], id: null }
        );
      }),
      tap(() => {
        this._accounts.next(updatedAccounts);
      })
    );
  }

  private calculateAccountBalanceOnAddOrDelete(
    isExpense: boolean,
    isDeletion: boolean,
    value: number
  ) {
    const currentAccount = this.getCurrentAccount();

    if ((isExpense && isDeletion) || (!isExpense && !isDeletion)) {
      // account balance grows
      currentAccount.balance += value;
    } else {
      // account balance goes down
      currentAccount.balance -= value;
    }

    this.setCurrentAccount(currentAccount);
  }

  private calculateAccountBalanceOnEdit(
    oldMovement: Movement,
    newMovement: Movement
  ) {
    const currentAccount = this.getCurrentAccount();
    if (oldMovement.isExpense) {
      currentAccount.balance += oldMovement.value;
    } else {
      currentAccount.balance -= oldMovement.value;
    }

    if (newMovement.isExpense) {
      currentAccount.balance -= newMovement.value;
    } else {
      currentAccount.balance += newMovement.value;
    }

    this.setCurrentAccount(currentAccount);
  }
}
