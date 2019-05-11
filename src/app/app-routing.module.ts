import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'movements',
    loadChildren: './movements/movements.module#MovementsPageModule'
  },
  {
    path: 'statistics',
    loadChildren: './statistics/statistics.module#StatisticsPageModule'
  },
  { path: 'about', loadChildren: './about/about.module#AboutPageModule' },
  {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsPageModule'
  },
  {
    path: 'accounts',
    loadChildren: './accounts/new-account.module#NewAccountPageModule'
  },

  {
    path: 'new-movement',
    loadChildren: './movements/new-movement/new-movement.module#NewMovementPageModule'
  },
  {
    path: 'categories',
    loadChildren: './movements/categories/categories.module#CategoriesPageModule'
  },
  { path: 'edit-movement/:movementId', loadChildren: './movements/edit-movement/edit-movement.module#EditMovementPageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
