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

  ngOnInit() {
    this.storage.get('save').then(hads => {
      this.allHads = hads;
    });
  }

}
