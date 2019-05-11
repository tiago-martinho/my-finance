import { Component, OnInit, OnDestroy } from '@angular/core';
import { Category } from './category.model';
import { Subscription } from 'rxjs';
import { MovementsService } from '../movements.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss']
})
export class CategoriesPage implements OnInit, OnDestroy {
  private categoriesSub: Subscription;
  isLoading = false;

  categories: Category[] = [];

  constructor(private movementsService: MovementsService, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.categoriesSub = this.movementsService.categories.subscribe(
      categories => {
        this.categories = categories;
      }
    );
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.movementsService.getMovementCategories().subscribe(() => {
      this.isLoading = false;
    });
  }

  onCategoryPick(category: Category) {
    this.modalCtrl.dismiss(
      {
        categoryData: {
          pickedCategory: category
        }
      },
      'confirm'
    );
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  ngOnDestroy() {
    if (this.categories) {
      this.categoriesSub.unsubscribe();
    }
  }
}
