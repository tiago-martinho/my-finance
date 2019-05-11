import { Component, OnInit, OnDestroy } from '@angular/core';
import { MovementDetail } from '../movement-detail';
import { MovementsService } from '../movements.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  LoadingController,
  NavController,
  AlertController,
  ModalController
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Movement } from '../movement.model';

@Component({
  selector: 'app-edit-movement',
  templateUrl: './edit-movement.page.html',
  styleUrls: ['./edit-movement.page.scss']
})
export class EditMovementPage extends MovementDetail
  implements OnInit, OnDestroy {
  movementId: string;
  movementDate: string;
  movementType: string;
  isLoading = false;
  private movementSub: Subscription;

  constructor(
    protected movementsService: MovementsService,
    protected router: Router,
    protected loadingCtrl: LoadingController,
    protected modalCtrl: ModalController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertCtrl: AlertController
    
  ) {
    super(movementsService, router, loadingCtrl, modalCtrl);
    console.log('child constructor');
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('movementId')) {
        this.navCtrl.navigateBack('/movements');
        return;
      }
      this.isLoading = true;
      this.movementSub = this.movementsService
        .getMovement(paramMap.get('movementId'))
        .subscribe(
          movement => {
            this.setFormValues(movement);
            this.isLoading = false;
          },
          error => {
            this.alertCtrl
              .create({
                header: 'An error ocurred!',
                message: 'Could not load movement.',
                buttons: [
                  {
                    text: 'Ok',
                    handler: () => {
                      this.router.navigate(['/movements']);
                    }
                  }
                ]
              })
              .then(alertElement => {
                alertElement.present();
              });
          }
        );
    });
    super.ngOnInit();
    console.log('child init');
  }

  setFormValues(movement: Movement) {
    this.movementId = movement.id;
    this.form.get('type').setValue(movement.isExpense ? 'expense' : 'income');
    this.form.get('category').setValue(movement.categoryName);
    this.form.get('description').setValue(movement.description);
    this.form.get('value').setValue(movement.value);
    this.form.get('date').setValue(movement.date.toISOString());
  }

  onUpdateMovement() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Updating movement...'
      })
      .then(loadingElement => {
        loadingElement.present();
        this.movementsService
          .updateMovement(
            this.movementId,
            this.category.id,
            this.category.name,
            this.form.value.description,
            this.form.value.type === 'expense' ? true : false,
            this.form.value.value,
            this.form.value.date
          )
          .subscribe(() => {
            loadingElement.dismiss();
            this.form.reset();
            this.router.navigate(['/movements']);
          });
      });
  }

  async onDeleteMovement() {
    await this.alertCtrl.create({
      header: 'Delete Movement',
      message: 'Are you sure you want to delete this movement?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('canceled');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.loadingCtrl
              .create({ message: 'Deleting movement...' })
              .then(loadingElement => {
                loadingElement.present();
                this.movementsService
                  .deleteMovement(this.movementId)
                  .subscribe(() => {
                    loadingElement.dismiss();
                    this.router.navigate(['/movements']);
                    console.log('deleted');
                  });
              });
          }
        }
      ]
    }).then(alertElement => {
      alertElement.present();
    });
  }

  ngOnDestroy(): void {
    if (this.movementSub) {
      this.movementSub.unsubscribe();
    }
  }
}
