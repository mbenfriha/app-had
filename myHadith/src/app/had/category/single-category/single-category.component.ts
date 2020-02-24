import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {first} from 'rxjs/operators';
import {CategoryService} from '../category.service';
import {Hadith} from '../../../_models/hadith';

@Component({
    selector: 'app-single-category',
    templateUrl: './single-category.component.html',
    styleUrls: ['./single-category.component.scss'],
})
export class SingleCategoryComponent implements OnInit {
    name: string;
    allHad: Hadith[];
    constructor( private actRoute: ActivatedRoute,
                 private categoryService: CategoryService) {
        this.name = this.actRoute.snapshot.params.name;
        this.loadAllHad();
    }

    ngOnInit() {}

    private loadAllHad(event = null) {
        this.categoryService.getAllByCategory(this.name).pipe(first()).subscribe(hadiths => {
            this.allHad = hadiths;
            if (event) {
                event.target.complete();
            }
        });
    }

}
