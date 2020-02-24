import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HadService} from './had.service';
import {first} from 'rxjs/operators';
import {Hadith} from '../_models/hadith';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
    selector: 'app-folder',
    templateUrl: './had.page.html',
    styleUrls: ['./had.page.scss'],
})
export class HadPage implements OnInit {
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
    allHad: Hadith[] = [];
    options = {page: 1, limit: 10};
    hasNextPage: boolean;

    constructor(private activatedRoute: ActivatedRoute,
                private hadService: HadService) { }

    ngOnInit() {
        this.loadAllHads();
    }

    loadData(event) {
        setTimeout(() => {
            this.loadAllHads(event);

            // App logic to determine if all data is loaded
            // and disable the infinite scroll
            console.log(this.hasNextPage)
            if (!this.hasNextPage) {
                console.log('acaceijfefrej')
                event.target.disabled = true;
            }
        }, 500);
    }

    private loadAllHads(event = null) {
        this.hadService.getAll(this.options).pipe(first()).subscribe((hadiths: any) => {
          //  this.allHad.push(hadiths.docs);
           // this.allHad.concat(hadiths.docs);
            this.allHad.push.apply(this.allHad, hadiths.docs);
            this.hasNextPage = hadiths.hasNextPage;
            console.log(this.hasNextPage);
            this.options.page = hadiths.nextPage;
            if (event) {
                event.target.complete();
            }
        });
    }
}
