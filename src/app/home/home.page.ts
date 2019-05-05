import { Component, OnInit } from '@angular/core';
import { UserAccount } from '../new-account/UserAccount.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  account = new UserAccount('id1', 'uid1', 'TestAcc1', 10000, null);

  constructor() {}

  ngOnInit() {

  }

}
