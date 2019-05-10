import { Component, OnInit } from '@angular/core';
import { MovementDetail } from '../movement-detail';
import { MovementsService } from '../movements.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-edit-movement',
  templateUrl: './edit-movement.page.html',
  styleUrls: ['./edit-movement.page.scss']
})
export class EditMovementPage extends MovementDetail
  implements OnInit {

  constructor(
    protected movementsService: MovementsService,
    protected router: Router,
    protected loadingCtrl: LoadingController
  ) {
    super(movementsService, router, loadingCtrl);
    console.log('child constructor');
  }

  ngOnInit() {
    super.ngOnInit();
    console.log('child init');
    this.getMovement('id');
  }

  getMovement(id: string) {
    console.log('geting movement ' + id);
  }

  onEditMovement() {
    if (!this.form.valid) {
      console.log('not valid');
    }
  }
}
