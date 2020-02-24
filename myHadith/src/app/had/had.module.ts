import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';



import { HadPageRoutingModule } from './had-routing.module';

import { HadPage } from './had.page';
import {CategoryComponent} from './category/category.component';
import {SingleCategoryComponent} from './category/single-category/single-category.component';
import {SingleComponent} from './single/single.component';
import {RandomComponent} from './random/random.component';
import {SaveComponent} from './save/save.component';



@NgModule({
  declarations: [
      HadPage,
      CategoryComponent,
      SingleCategoryComponent,
      SingleComponent,
      RandomComponent,
      SaveComponent
  ],
  imports: [
      CommonModule,
      FormsModule,
      IonicModule,
      HadPageRoutingModule
  ]
})
export class HadModule { }
