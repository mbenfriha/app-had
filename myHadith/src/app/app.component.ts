import {Component, NgZone, OnInit} from '@angular/core';

import {AlertController, LoadingController, Platform, ToastController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {Storage} from '@ionic/storage';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import {HadPage} from './had/had.page';
import {SingleComponent} from './had/single/single.component';
import {Router} from '@angular/router';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free/ngx';
import {environment} from '../environments/environment';
import {InAppPurchase} from '@ionic-native/in-app-purchase/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';

const BUY_PREMIUM = 'com.mohamedbenfriha.alahadith.premium';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
    public selectedIndex = 0;
    premium = false;
    products = [];
    previousPurchases = [];

    pub = environment.pub;
    public appPages = [
        {
            title: 'Accueil',
            url: '/home',
            icon: 'home'
        },
        {
            title: 'Catégories',
            url: '/categories',
            icon: 'archive'
        },
        {
            title: 'Hasard',
            url: '/random',
            icon: 'shuffle'
        },
        {
            title: 'Sauvegardé',
            url: '/save',
            icon: 'save'
        },
    ];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private storage: Storage,
        private deeplinks: Deeplinks,
        private router: Router,
        private zone: NgZone,
        private admobFree: AdMobFree,
        private iap: InAppPurchase,
        public toastController: ToastController,
        public alertController: AlertController,
        public loadingController: LoadingController,
        private appRate: AppRate
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.setupDeeplinks();

            this.appRate.preferences.storeAppURL = {
                ios: '1500769223',
            };
            this.appRate.preferences.displayAppName = "Al Ahadith";
            this.appRate.preferences.customLocale = {
                title: "Veux-tu noter %@ ?",
                message: "Ça ne prendra pas plus d'une minute et ça contribue à promouvoir l'application. Merci !",
                cancelButtonLabel: "Non, merci",
                laterButtonLabel: "Plus tard",
                rateButtonLabel: "Noter maintenant",
                yesButtonLabel: "Oui !",
                noButtonLabel: "Pas vraiment",
                appRatePromptTitle: 'Est ce que tu aimes %@ ?',
                feedbackPromptTitle: 'Veux tu nous faire un retour ?',
            };

            this.appRate.promptForRating(false);

            this.iap.getProducts([BUY_PREMIUM])
                .then((products) => {
                    this.products = products;
                })
                .catch((err) => {
                    console.log(err);
                });
            this.storage.get('premium').then((premium) => {
                if (!premium) {
                    this.admobFree.interstitial.config({
                        id: 'ca-app-pub-9393734224464508/9340595714',
                        isTesting: this.pub,
                    })

                    // this.admobFree.interstitial.prepare();

                  //  this.admobFree.interstitial.show();
                }
            });
        });
    }

    setupDeeplinks() {
        this.deeplinks.route({ '/:id': 'had', '' : '', '/h/:id': 'had' }).subscribe(
            match => {
                const id = 'id';
                let internalPath = `/`;
                console.log('Successfully matched route', match);

                // Create our internal Router path by hand
                if (match.$args[id]) {
                    internalPath = `/${match.$route}/${match.$args[id]}`;
                }
               // const internalPath = '/';

                // Run the navigation in the Angular zone
                this.zone.run(() => {
                    this.router.navigateByUrl(internalPath);
                });
            },
            nomatch => {
                // nomatch.$link - the full link data
              //  console.log(nomatch.$link.path);
              //  console.error('Got a deeplink that didn\'t match', nomatch);

            }
        );
    }

    ngOnInit() {
        this.storage.get('save').then((save) => {
            if (!save) {
                this.storage.set('save', []);
            }
        });
    }

    async buyPrem() {

        const loading = await this.loadingController.create({});
        await loading.present();


        console.log('Loading dismissed!');
            this.iap.buy(BUY_PREMIUM).then(data => {
                loading.dismiss();
            this.enablePremium(BUY_PREMIUM);

        }) .catch(async (err) => {

                loading.dismiss();
                console.log(err);
                const alert = await this.alertController.create({
                    header: 'Erreur',
                    message: err.errorMessage,
                    buttons: ['OK']
                });

                await alert.present();
            });;
    }

   async restore() {

        const loading = await this.loadingController.create({});
        await loading.present();

       this.iap.restorePurchases().then(async purchases => {

           if(purchases.length < 1) {
               const alert = await this.alertController.create({
                   header: 'Information',
                   message: "\n" +
                       "Aucune transaction antérieur trouvé. " +
                       "Pour restaurer le produit acheté, appuyez 'acheter' à nouveau. " +
                       "Si vous avez déjà payé vous ne ne serez pas facturé, mais l'achat sera rétabli.",
                   buttons: ['OK']
               });

               await alert.present();
           }
           else {
               this.previousPurchases = purchases;
               // Unlock the features of the purchases!
               for (let prev of this.previousPurchases) {
                   this.enablePremium(prev.productId);
               }


               this.presentToast('Achat restauré !');
           }

           loading.dismiss();
        }) .catch(async (err) => {

           loading.dismiss();
            console.log(err);
                const alert = await this.alertController.create({
                    header: 'Erreur',
                    message: err.errorMessage,
                    buttons: ['OK']
                });

                await alert.present();
        });
    }

    enablePremium(id) {
        // Normally store these settings/purchases inside your app or server!
        if (id === BUY_PREMIUM) {
            this.premium = true;
            this.storage.set('premium', true);
        }
    }

    async presentToast(message: string) {
        const mess = message;
        const toast = await this.toastController.create({
            message: mess,
            duration: 2000
        });
        toast.present();
    }

    rate() {
        console.log('note');
        this.appRate.navigateToAppStore();
    }
}
