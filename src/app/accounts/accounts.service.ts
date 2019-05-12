import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { BankAccount } from './bank-account.model';
import { switchMap, take, tap, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

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

}
