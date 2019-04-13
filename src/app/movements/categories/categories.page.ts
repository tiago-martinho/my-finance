import { Component, OnInit } from '@angular/core';
import { Category } from './category.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  categories: Category[] = [new Category('c1', 'category1', 'url'), new Category('c2', 'category2', 'url')]

  constructor() { }

  ngOnInit() {
  }

  onCategoryClick() {
    console.log('clicked category');
  }

}
