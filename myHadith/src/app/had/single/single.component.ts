import {AfterViewInit, Component, OnInit} from '@angular/core';
import {HadService} from '../had.service';
import {first} from 'rxjs/operators';
import {Hadith} from '../../_models/hadith';
import {ActivatedRoute} from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { Clipboard } from '@ionic-native/clipboard/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import {AdMobFree} from '@ionic-native/admob-free/ngx';
import {environment} from '../../../environments/environment';



@Component({
    selector: 'app-single',
    templateUrl: './single.component.html',
    styleUrls: ['./single.component.scss'],
})
export class SingleComponent implements OnInit, AfterViewInit {
    had: Hadith;
    load = true;
    currentLang = 'fr';

    pub = environment.pub;
    constructor(
        private hadService: HadService,
        private actRoute: ActivatedRoute,
        private clipboard: Clipboard,
        public toastController: ToastController,
        private storage: Storage,
        private socialSharing: SocialSharing,
        private admobFree: AdMobFree) {
        this.loadHad(this.actRoute.snapshot.params.id);
    }

    ngOnInit() {

    }
    ngAfterViewInit(): void {
        this.storage.get('premium').then((premium) => {
            if (!premium) {
                this.admobFree.interstitial.config({
                    id: 'ca-app-pub-9393734224464508/9340595714',
                    isTesting: this.pub,
                })

                this.admobFree.interstitial.prepare();

                this.admobFree.interstitial.show();
            }
        });
    }

    share(had) {

        const text = had.title + '\n \n' + had.translate[0].text + '\n' + had.collections[0].name + ' n°' + had.number + '\n al-ahadith.com/h/' + had._id ;

        this.socialSharing.share(text, had.title, null, 'al-ahadith.com/h/' + had._id).then(res => {
        }).catch(e => {});

    }

    async presentToast(message: string) {
        const mess = message;
        const toast = await this.toastController.create({
            message: mess,
            duration: 2000
        });
        toast.present();
    }
    copy(had) {

        this.clipboard.copy(had.title + '\n \n' + had.translate[0].text + '\n' + had.collections[0].name + ' n°' + had.number + '\n Vu sur l\'app al-ahadith.com');

        this.presentToast('Hadith copié !');
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
