import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  HttpParams
  , HttpClient
} from '@angular/common/http';
import { GlobalVariable } from '../../global';


@Injectable({
  providedIn: 'root'
})
export class ErrorsService {
  private subject = new Subject<any>();
  private searchSubject = new Subject<string[]>();
  private showSearchSubject = new Subject<boolean>();
  firstChar: boolean = true;
  options: string[] = [];
  filteredOptions = new Observable<string[]>();
  private baseApiUrl = GlobalVariable.BASE_API_URL;

  constructor(private http: HttpClient) { }

  sendMessage(message: string) {
    this.subject.next({ error: message });
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  setSearchInput(value: string) {
    if (value == "") {
      this.firstChar = true;
      this.options = [];
      this.searchSubject.next(this._filter(value));
      this.showSearchSubject.next(false);

    }
    if (this.firstChar && value != "") {
      this.getSearchResults(value);
      this.firstChar = false;
      this.showSearchSubject.next(true);

    }
    if (!this.firstChar) {
      this.searchSubject.next(this._filter(value));
      this.showSearchSubject.next(true);
    }
  }

  getSearchCondition(): Observable<boolean> {
    return this.showSearchSubject.asObservable();
  }

  getSearchInput(): Observable<string[]> {
    return this.searchSubject.asObservable();
  }

  search(char: string): Observable<Array<any>> {
    let params = new HttpParams().set('query', char);
    return this.http.get<any[]>(this.baseApiUrl + '/general/search', {
      params: params
    });
  }

  getSearchResults(value: string) {
    this.search(value).subscribe(res => {
      res.forEach(element => {
        this.options.push(element.username);
      })
      this.searchSubject.next(this._filter(value));
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

}
