import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { FeedService } from '../../services/feed.service';
import { FormGroup, FormBuilder } from '../../../../node_modules/@angular/forms';
import { UserService } from '../../services/user.service';
import { takeUntil } from 'rxjs/operators';
import { ErrorsService } from '../../services/errors.service';
import * as $ from 'jquery';
import { GlobalVariable } from '../../../global';
import { ViewProfileComponent } from '../view-profile/view-profile.component';
import { Routes, Router } from '../../../../node_modules/@angular/router';


@Component({
  selector: 'app-shopping-nav',
  templateUrl: './shopping-nav.component.html',
  styleUrls: ['./shopping-nav.component.css']
})
export class ShoppingNavComponent implements OnInit {
  showBack: boolean = false;
  searchForm: FormGroup;
  firstChar: boolean = true;
  placeholder = "search &#xF002";
  options = [];
  filteredOptions: Observable<string[]>;
  sideNavOpend: boolean = false;
  mainList = ['CATEGORIES', 'DESIGNERS', 'STORES', 'PRICE'];
  originalList = {};
  displayList = {};
  categories = ['CLOTHINGS', 'SHOES', 'BAGS', 'ACCESSORIES'];
  clothings = [
    'ALL CLOTHING',
    'TOPS',
    'JACKETS & COATS',
    'DRESSES & SKIRTS',
    'PANTS',
    'SWIMWEAR'
  ];
  designers = ['ALL DESIGNERS', 'GUCCI', 'PRADA', 'D&G'];
  stores = [
    'ALL STORES',
    'ZARA',
    'FAR FETCH',
    'SHOPBOP',
    'ASOS',
    'TerminalX',
    'ADIKA'
  ];
  price = ['ALL PRICES', '>1000', '1000-5000', '<5000'];
  icon = 'menu';
  arrow_back = 'arrow_back_ios';
  currKey: string;
  prevKey: string;
  onDestroy: Subject<void> = new Subject<void>();
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches
  )

  );
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  routes: Routes = [{ path: 'profile/:id', component: ViewProfileComponent }];
  constructor(
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private feedService: FeedService,
    private errorService: ErrorsService,
    private router: Router) {
    this.originalList['CATEGORIES'] = this.categories;
    this.originalList['CLOTHINGS'] = this.clothings;
    this.originalList['DESIGNERS'] = this.designers;
    this.originalList['STORES'] = this.stores;
    this.originalList['PRICE'] = this.price;
    this.displayList['CATEGORIES'] = this.categories;
    this.displayList['DESIGNERS'] = this.designers;
    this.displayList['STORES'] = this.stores;
    this.displayList['PRICE'] = this.price;
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      search: ['']
    })
    this.isHandset$.subscribe(res => {
      console.log(res, "is res");
    })
    this.onChanges();
  }
  onChanges(): void {
    this.searchForm.controls['search'].valueChanges.pipe(takeUntil(this.onDestroy)).subscribe(val => {
      this.setSearchInput(val);
    })
  }


  getKeys() {
    return Object.keys(this.displayList);
  }

  getValues(key) {
    this.prevKey = this.currKey;
    this.currKey = key;

    if (key === 'back') {
      if (this.prevKey == 'CLOTHINGS') {
        this.mainList = Object.values(this.originalList['CATEGORIES']);
      }
      else {
        this.mainList = this.getKeys();
        this.showBack = false;
      }

    } else {
      this.mainList = Object.values(this.originalList[key]);
      this.showBack = true;
    }
  }

  setSearchInput(value: string) {
    if (value == "") {
      this.firstChar = true;
      this.options = [];
      this.filteredOptions = this._filter(value);
      // this.showSearchSubject.next(false);

    }
    if (this.firstChar && value != "") {
      this.getSearchResults(value);
      this.firstChar = false;
    }
    if (!this.firstChar) {
      this.filteredOptions = this._filter(value);
    }



  }

  getSearchResults(value: string) {
    let baseAPI = this.baseApiUrl + '/image?s3key=';
    this.userService.search(value).subscribe(res => {
      res.forEach(element => {
        let searchObject = {
          userName: element.username,
          profileImgSrc: baseAPI + element.userProfileImageAddr,
          id: element.id
        };
        this.options.push(searchObject);
      })
      this.filteredOptions = this._filter(value);
    })
  }

  private _filter(value: string): Observable<any> {
    const filterValue = value.toLowerCase();
    return Observable.of(
      this.options.filter(option => option.userName.toLowerCase().includes(filterValue))
    );
  }

  searchUser(searchResult) {
    this.router.navigate(['profile', searchResult.id]);
  }

  onOpen() {
    this.sideNavOpend = true;
  }

  onClose() {
    this.icon = 'menu';
  }
}
