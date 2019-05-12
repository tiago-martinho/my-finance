import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { BankAccount } from './bank-account.model';
import { switchMap, take, tap, map } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';
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
  private currentAccount: BankAccount;

  private _accounts = new BehaviorSubject<BankAccount[]>([]);

  get accounts() {
    return this._accounts.asObservable();
  }

  constructor(private http: HttpClient, private auth: AuthService) { }

  addAccount(name: string, balance: number) {
    let generatedId;

    const newBankAccount = new BankAccount(null, this.auth.userId, name, balance);

    return this.http
    .post<{ name: string }>(
      this.accountsUrl + '.json',
      { ...newBankAccount, id: null }
    )
    .pipe(
      switchMap(response => {
        generatedId = response.name;
        return this.accounts;
      }),
      take(1),
      tap(accounts => {
        newBankAccount.id = generatedId;
        this._accounts.next(accounts.concat(newBankAccount));
      })
    );
  }

  getAccounts() {
    return this.http
      .get<{ [key: string]: AccountData }>(this.accountsUrl + '.json')
      .pipe(
        map(response => {
          const accounts = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              accounts.push(
                new BankAccount(
                  key,
                  response[key].userId,
                  response[key].name,
                  response[key].balance
                )
              );
            }
          }
          return accounts;
        }),
        tap(accounts => {
          this._accounts.next(accounts);
        })
      );
  }

  getCurrentAccount() {
    return this.currentAccount;
  }

  setCurrentAccount(account: BankAccount) {
    this.currentAccount = account;
  }

  setAccountBalance(balance: number) {
    this.currentAccount.balance = balance;
  }

  updateAccountBalanceOnAddOrDelete(isExpense: boolean, isDeletion: boolean, value: number) {
    this.calculateAccountBalanceOnAddOrDelete(isExpense, isDeletion, value);
    this.updateAccountBalance().subscribe();
  }

  updateAccountBalanceOnEdit(oldMovement: Movement, newMovement: Movement) {
    this.calculateAccountBalanceOnEdit(oldMovement, newMovement);
    this.updateAccountBalance().subscribe();

  }

  private updateAccountBalance() {
    let updatedAccounts: BankAccount[];
    return this.accounts.pipe(
      take(1),
      switchMap(accounts => {
        if (!accounts || accounts.length === 0) {
          return this.getAccounts()
        } else {
          return of(accounts);
        }
      }),
      switchMap(accounts => {
        const updatedAccountIndex = accounts.findIndex(a => a.id === this.currentAccount.id);
        updatedAccounts = [...accounts];
        updatedAccounts[updatedAccountIndex] = this.currentAccount;
        return this.http.put(
          `${this.accountsUrl}/${this.currentAccount.id}.json`,
          {...updatedAccounts[updatedAccountIndex], id: null}
        );
      }),
      tap(() => {
        this._accounts.next(updatedAccounts);
      })
    );
  }

  private calculateAccountBalanceOnAddOrDelete(isExpense: boolean, isDeletion: boolean, value: number) {
    if ( (isExpense && isDeletion) || (!isExpense && !isDeletion)) { // account balance grows
      this.currentAccount.balance += value;
    } else { // account balance goes down
      this.currentAccount.balance -= value;
    }
  }

  private calculateAccountBalanceOnEdit(oldMovement: Movement, newMovement: Movement) {

    if (oldMovement.isExpense) {
      this.currentAccount.balance += oldMovement.value;
    } else {
      this.currentAccount.balance -= oldMovement.value;
    }

    if (newMovement.isExpense) {
      this.currentAccount.balance -= newMovement.value;
    } else {
      this.currentAccount.balance += newMovement.value;
    }
  }
}
