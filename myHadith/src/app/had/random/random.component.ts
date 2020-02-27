import { Component, OnInit } from '@angular/core';
import {HadService} from '../had.service';
import {Hadith} from '../../_models/hadith';
import {first} from 'rxjs/operators';

@Component({
    selector: 'app-random',
    templateUrl: './random.component.html',
    styleUrls: ['./random.component.scss'],
})
export class RandomComponent implements OnInit {
    had: Hadith;
    load = true;

    constructor(private hadService: HadService) { }

    ngOnInit() {
        this.loadHad();

    }


    refreshData(event) {
        this.loadHad(event);
    }


    private loadHad(event = null) {
        this.hadService.random().pipe(first()).subscribe(hadith => {
            this.had = hadith;
            this.load = false;
            if (event) {
                event.target.complete();
            }
        });
    }

}
