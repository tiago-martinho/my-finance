import { Component, OnInit } from '@angular/core';
import { MovementsService } from '../movements.service';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { MovementDetail } from '../movement-detail';

@Component({
  selector: 'app-new-movement',
  templateUrl: './new-movement.page.html',
  styleUrls: ['./new-movement.page.scss'],
})
export class NewMovementPage extends MovementDetail implements OnInit {

  constructor(protected movementsService: MovementsService,
    protected router: Router,
    protected loadingCtrl: LoadingController,
    protected modalCtrl: ModalController) {
      super(movementsService, router, loadingCtrl, modalCtrl);
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
            this.form.value.type === 'expense' ? true : false,
            this.form.value.description,
            this.category.id,
            this.category.name,
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
