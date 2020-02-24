import { Component, OnInit } from '@angular/core';
import {Category} from '../../_models/category';
import {first} from 'rxjs/operators';
import {CategoryService} from './category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
    category: Category[];

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.loadAllCategory();
  }

    private loadAllCategory() {
        this.categoryService.getAll().pipe(first()).subscribe(category => {
            this.category = category;

        });
    }

}
