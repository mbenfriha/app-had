import { Component, OnInit } from '@angular/core';
import {HadService} from '../had.service';
import {first} from 'rxjs/operators';
import {Hadith} from '../../_models/hadith';
import {ActivatedRoute} from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

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
        private clipboard: Clipboard,
        public toastController: ToastController,
        private storage: Storage) {
        this.loadHad(this.actRoute.snapshot.params.id);
    }

    ngOnInit() {

        this.storage.get('save').then((save) => {
            if (!save) {
                this.storage.set('save', []);
            }
        });
    }

    share(had) {

    }

    async presentToast(message) {
        const toast = await this.toastController.create({
            message: 'message',
            duration: 2000
        });
        toast.present();
    }
    copy(had) {

        this.clipboard.copy(had.title + '\n \n' + had.translate[0].text + '\n' + had.translate[1].text);

        this.clipboard.paste().then(
            (resolve: string) => {
                this.presentToast('Hadith copié !');
            },
            (reject: string) => {
                alert('Error: ' + reject);
            }
        );

        this.clipboard.clear();
    }

    save(had) {
        this.storage.get('save').then((save) => {
            let saveAr = save;
            saveAr.push(had);

            this.storage.set('save', saveAr);
            this.presentToast('Hadith sauvegardé !');
        });
    }

    private loadHad(id) {
        this.hadService.get(id).pipe(first()).subscribe(hadith => {
            this.had = hadith;
            this.load = false;
        });
    }

}
