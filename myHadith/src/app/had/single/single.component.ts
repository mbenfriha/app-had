import { Component, OnInit } from '@angular/core';
import {HadService} from '../had.service';
import {first} from 'rxjs/operators';
import {Hadith} from '../../_models/hadith';
import {ActivatedRoute} from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { Clipboard } from '@ionic-native/clipboard/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';



@Component({
    selector: 'app-single',
    templateUrl: './single.component.html',
    styleUrls: ['./single.component.scss'],
})
export class SingleComponent implements OnInit {
    had: Hadith;
    load = true;
    currentLang = 'fr';
    constructor(
        private hadService: HadService,
        private actRoute: ActivatedRoute,
        private clipboard: Clipboard,
        public toastController: ToastController,
        private storage: Storage,
        private socialSharing: SocialSharing) {
        this.loadHad(this.actRoute.snapshot.params.id);
    }

    ngOnInit() {
    }

    share(had) {

        const text = had.title + '\n \n' + had.translate[0].text + '\n' + had.collections[0].name + ' n°' + had.number  ;

        this.socialSharing.share(text, had.title, null, 'al-ahadith.com/had/' + had._id).then(res => {
            console.log('cool');
        }).catch(e => {
            console.log(e);
        });
        /*      this.socialSharing.shareViaWhatsApp(text, null, 'https://al-ahadith.com').then((res) => {
                  // Success
              }).catch((e) => {
                  // Error!
              });
              this.socialSharing.shareViaInstagram(text, null).then((res) => {
                  // Success
              }).catch((e) => {
                  // Error!
              });

              this.socialSharing.shareViaFacebook(text, null, 'https://al-ahadith.com').then((res) => {
                  // Success
              }).catch((e) => {
                  // Error!
              });

              this.socialSharing.shareViaTwitter(text, null, 'https://al-ahadith.com').then((res) => {
                  // Success
              }).catch((e) => {
                  // Error!
              });

              // Check if sharing via email is supported
              this.socialSharing.canShareViaEmail().then(() => {
                  // Sharing via email is possible
              }).catch(() => {
                  // Sharing via email is not possible
              });

      // Share via email
              this.socialSharing.shareViaEmail(text, had.title, ['recipient@example.org']).then(() => {
                  // Success!
              }).catch(() => {
                  // Error!
              });*/
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

    private loadHad(id) {
        this.hadService.get(id).pipe(first()).subscribe(hadith => {
            this.had = hadith;
            this.load = false;
        });
    }

}
