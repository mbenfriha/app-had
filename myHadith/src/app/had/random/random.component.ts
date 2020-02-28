import { Component, OnInit } from '@angular/core';
import {HadService} from '../had.service';
import {Hadith} from '../../_models/hadith';
import {first} from 'rxjs/operators';
import {Clipboard} from '@ionic-native/clipboard/ngx';
import {ToastController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';

@Component({
    selector: 'app-random',
    templateUrl: './random.component.html',
    styleUrls: ['./random.component.scss'],
})
export class RandomComponent implements OnInit {
    had: Hadith;
    load = true;
    currentLang = 'fr';

    constructor(private hadService: HadService,
                private clipboard: Clipboard,
                public toastController: ToastController,
                private storage: Storage,
                private socialSharing: SocialSharing) { }

    ngOnInit() {
        this.loadHad();

    }


    refreshData(event) {
        this.loadHad(event);
    }

    share(had) {
        const text = had.title + '\n \n' + had.translate[0].text + '\n' + had.collections[0].name + ' n°' + had.number  ;

        this.socialSharing.share(text, had.title, null, 'al-ahadith.com/had/' + had._id).then(res => {
        }).catch(e => {
            console.log(e);
        });
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
