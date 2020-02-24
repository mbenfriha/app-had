import { Injectable } from '@angular/core';
import {Hadith} from '../_models/hadith';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HadService {
    url = environment.API_URL;
    constructor(private http: HttpClient) { }
    getAll(options) {
        console.log(options);
        return this.http.post<Hadith[]>(this.url + `had`, options);
    }
    get(id) {
        return this.http.get<Hadith>(this.url + `had/` + id);
    }
}
