import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Category} from '../../_models/category';
import {Hadith} from '../../_models/hadith';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
    url = environment.API_URL;
    constructor(private http: HttpClient) { }
    getAll() {
        return this.http.get<Category[]>(this.url + `category`);
    }
    getAllByCategory(category) {
        return this.http.post<Hadith[]>(this.url + `had/category`, {category});
    }
}
