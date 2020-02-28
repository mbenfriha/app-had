import {Component, NgZone, OnInit} from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {Storage} from '@ionic/storage';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import {HadPage} from './had/had.page';
import {SingleComponent} from './had/single/single.component';
import {Router} from '@angular/router';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
    public selectedIndex = 0;
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
        private zone: NgZone
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.setupDeeplinks();
        });
    }

    setupDeeplinks() {
        this.deeplinks.route({ '/:id': 'had', '' : '' }).subscribe(
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
                console.log(nomatch.$link.path);
                console.error('Got a deeplink that didn\'t match', nomatch);

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
}
