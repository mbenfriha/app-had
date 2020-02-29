import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HadService} from './had.service';
import {first} from 'rxjs/operators';
import {Hadith} from '../_models/hadith';
import { IonInfiniteScroll } from '@ionic/angular';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-folder',
    templateUrl: './had.page.html',
    styleUrls: ['./had.page.scss'],
})
export class HadPage implements OnInit {
    @ViewChild(IonInfiniteScroll, {static: true}) infiniteScroll: IonInfiniteScroll;
    allHad$: Subject<Hadith[]> = new Subject();
    allHads: Hadith[] = [];
    options = {page: 1, limit: 15};
    hasNextPage: boolean = true;
    public inputValue: string;
    public debouncedInputValue = this.inputValue;
    private searchDecouncer$: Subject<string> = new Subject();



    constructor(private activatedRoute: ActivatedRoute,
                private hadService: HadService) { }

    ngOnInit() {
        if (this.options.page == 1) {
            this.loadAllHads();
        }
        this.setupSearchDebouncer();

    }

    public onSearchInputChange(term: string): void {
        // `onSearchInputChange` is called whenever the input is changed.
        // We have to send the value to debouncing observable
        this.searchDecouncer$.next(term);
    }

    private setupSearchDebouncer(): void {
        // Subscribe to `searchDecouncer$` values,
        // but pipe through `debounceTime` and `distinctUntilChanged`
        this.searchDecouncer$.pipe(
            debounceTime(100),
            distinctUntilChanged(),
        ).subscribe((term: string) => {
            // Remember value after debouncing
            this.debouncedInputValue = term;

            // Do the actual search
            if (this.inputValue !== '') {
                this.search(term);
            } else {
                this.allHad$.next(this.allHads);

            }
        });
    }

    private search(term: string): void {
        // Clear results
        this.allHad$.next(null);

        this.hadService.searchHad({search: term}).pipe(first()).subscribe((hadiths: any) => {
            this.allHad$.next(hadiths);
        });
    }

    loadData(event) {
        setTimeout(() => {
            this.loadAllHads(event);

            // App logic to determine if all data is loaded
            // and disable the infinite scroll
            console.log(this.hasNextPage)
            if (!this.hasNextPage) {
                event.target.disabled = true;
            }
        }, 500);
    }

    loadAllHads(event = null) {
        if (this.options.page == 1) {
            this.allHads =  [];
            this.allHad$.next(null);
        }
        if (this.hasNextPage) {
            this.hadService.getAll(this.options).pipe(first()).subscribe((hadiths: any) => {
                this.allHads.push.apply(this.allHads, hadiths.docs);

                this.allHad$.next(this.allHads);
                this.hasNextPage = hadiths.hasNextPage;
                console.log(this.hasNextPage);
                this.options.page = hadiths.nextPage;
                if (event) {
                    event.target.complete();
                }
            });
        }
    }
}
