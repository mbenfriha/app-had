import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HadPage } from './had.page';
import {CategoryComponent} from './category/category.component';
import {SingleCategoryComponent} from './category/single-category/single-category.component';
import {SingleComponent} from './single/single.component';
import {RandomComponent} from './random/random.component';
import {SaveComponent} from './save/save.component';

const routes: Routes = [
    {
        path: 'home',
        component: HadPage
    },
    {
        path: 'categories',
        component: CategoryComponent
    },
    {
        path: 'categories/:name',
        component: SingleCategoryComponent
    },
    {
        path: 'had/:id',
        component: SingleComponent
    },
    {
        path: 'random',
        component: RandomComponent
    },
    {
        path: 'save',
        component: SaveComponent
    },

];

@NgModule({
    imports: [
        RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HadPageRoutingModule {}
