import { Component, OnInit } from '@angular/core';
import {HadService} from '../had.service';
import {first} from 'rxjs/operators';
import {Hadith} from '../../_models/hadith';
import {ActivatedRoute} from '@angular/router';

import { Clipboard } from '@ionic-native/clipboard/ngx';


@Component({
    selector: 'app-single',
    templateUrl: './single.component.html',
    styleUrls: ['./single.component.scss'],
})
export class SingleComponent implements OnInit {
    had: Hadith;
    load = true;

    constructor(
        private hadService: HadService,
        private actRoute: ActivatedRoute,
        private clipboard: Clipboard) {
        this.loadHad(this.actRoute.snapshot.params.id);
    }

    ngOnInit() {}

    share(had) {

    }
    copy(had) {

        this.clipboard.copy(had.translate[0].text + "\n" + had.translate[1].text);

        this.clipboard.paste().then(
            (resolve: string) => {
                alert(resolve);
            },
            (reject: string) => {
                alert('Error: ' + reject);
            }
        );

        this.clipboard.clear();

    }

    save(had) {

    }

    private loadHad(id) {
        this.hadService.get(id).pipe(first()).subscribe(hadith => {
            this.had = hadith;
            this.load = false;
        });
    }

}
