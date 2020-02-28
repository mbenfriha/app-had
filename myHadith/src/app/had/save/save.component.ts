import { Component, OnInit } from '@angular/core';
import {Storage} from '@ionic/storage';
import {Hadith} from '../../_models/hadith';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss'],
})
export class SaveComponent implements OnInit {
    allHads: Hadith[] = [];

    constructor(
      private storage: Storage) { }

      deleteHad(i) {
        this.allHads.splice(i, 1);
        this.storage.set('save', this.allHads);
      }

  ngOnInit() {
    this.storage.get('save').then(hads => {
      this.allHads = hads;
    });
  }

}
