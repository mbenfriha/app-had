import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
    API_URL = 'http://localhost:6001/had';
  constructor(
      private http: HttpClient
  ) { }


  public getHad() {
        return this.http.get(this.API_URL);
    }

    public searchHad(search: string) {
        return this.http.post(this.API_URL + '/search', {search});
    }
}
