import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StatisticsPage } from './statistics.page';
import { ChartsModule } from 'ng2-charts';

const routes: Routes = [
  {
    path: '',
    component: StatisticsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChartsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StatisticsPage]
})
export class StatisticsPageModule {}
