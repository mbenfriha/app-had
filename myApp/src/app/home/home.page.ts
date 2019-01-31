import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import {Had} from './Had';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit  {

  had = {};
  constructor(
      private apiService: ApiService
  ) {}

  getAllHad() {
      this.apiService.getHad()
          .subscribe((had: Had) => {
            this.had = had.value;
            console.log(this.had);
          });
  }
  RefreshHad(event) {
    this.getAllHad();
      setTimeout(() => {
          console.log('Async operation has ended');
          event.target.complete();
      }, 1000);
  }

    searchHad(event) {
    this.apiService.searchHad(event.target.value)
        .subscribe((had: Had) => {
            this.had = had.value;
            console.log(this.had);
        });
    }

    ngOnInit() {
      this.getAllHad();
  }
}
