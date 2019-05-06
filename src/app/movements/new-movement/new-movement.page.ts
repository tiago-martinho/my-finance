import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MovementsService } from '../movements.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Category } from '../categories/category.model';

@Component({
  selector: 'app-new-movement',
  templateUrl: './new-movement.page.html',
  styleUrls: ['./new-movement.page.scss'],
})
export class NewMovementPage implements OnInit {
  form: FormGroup;

  constructor( private movementsService: MovementsService,
    private router: Router,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.form = new FormGroup({
      type: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      value: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      date: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }


  onPickCategory() {
    console.log('test');
  }

  onCreateMovement() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Creating place...'
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
