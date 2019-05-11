import { CategoriesModal } from './categories.modal';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
        CategoriesModal
    ],
    imports: [
        IonicModule,
        CommonModule
    ],
    entryComponents: [
        CategoriesModal
    ]
  })
  export class CategoriesModule {
  }
