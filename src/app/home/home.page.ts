import { Component, OnInit } from '@angular/core';
import { UserAccount } from '../new-account/UserAccount.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  accounts: UserAccount[] = [new UserAccount('id1', 'uid1', 'TestAcc1', 10000, null),
  new UserAccount('id2', 'uid1', 'testacc2', 20000, null)];

  constructor() {}

  ngOnInit() {

  }

}
