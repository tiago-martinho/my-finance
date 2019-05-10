import { Component, OnInit } from '@angular/core';
import { MovementsService } from '../movements.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Category } from '../categories/category.model';
import { MovementDetail } from '../movement-detail';

@Component({
  selector: 'app-new-movement',
  templateUrl: './new-movement.page.html',
  styleUrls: ['./new-movement.page.scss'],
})
export class NewMovementPage extends MovementDetail implements OnInit {

  constructor(protected movementsService: MovementsService,
    protected router: Router,
    protected loadingCtrl: LoadingController) {
      super(movementsService, router, loadingCtrl);
      console.log('In new');
     }


  onCreateMovement() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Adding movement...'
      })
      .then(loadingElement => {
        loadingElement.present();
        console.log(this.form);
        this.movementsService
          .addMovement(
            'accountId1',
            this.form.value.type,
            this.form.value.description,
            new Category('id1', 'comida', 'urlIcon1'),
            this.form.value.value,
            new Date(this.form.value.date)
          )
          .subscribe(() => {
            loadingElement.dismiss();
            this.form.reset();
            this.router.navigate(['/movements']);
          });
      });
  }
}
