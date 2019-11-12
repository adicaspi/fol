import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
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
import { Routes, Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { FilteringDTO } from '../../models/FilteringDTO';
import { MatSidenav } from '../../../../node_modules/@angular/material';


@Component({
  selector: 'app-shopping-nav',
  templateUrl: './shopping-nav.component.html',
  styleUrls: ['./shopping-nav.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ShoppingNavComponent implements OnInit {
  @ViewChild('drawer', { static: false }) public drawer: MatSidenav;
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
  categories = [{ id: 1, name: 'All Categories' }, { id: 2, name: 'Clothing' }, { id: 3, name: 'Shoes' }, { id: 4, name: 'Bags' }, { id: 5, name: 'Accessories' }];
  clothings = [
    { id: 1, name: 'Tops', servername: 'Tops' },
    { id: 2, name: 'Jackets & Coats', servername: 'JacketsOrCoats' },
    { id: 3, name: 'Dresses & Skirts', servername: 'DressesOrSkirts' },
    { id: 4, name: 'Pants', servername: 'Pants' },
    { id: 5, name: 'Shorts', servername: 'Shorts' },
    { id: 6, name: 'Lingerie', servername: 'Lingerie' }
  ];
  designers = [{ id: 1, name: 'Gucci' }, { id: 2, name: 'Prada' }, { id: 3, name: 'D&G', }, { id: 4, name: 'Isabel Marant' }, { id: 5, name: 'Loewe' }, { id: 6, name: 'Saint Laurent' }, { id: 7, name: 'Celine' }, { id: 8, name: 'Givenchy' }, { id: 9, name: 'Fendi' }];
  stores = [{ id: 1, name: 'ASOS' }, { id: 2, name: 'ZARA' }, { id: 3, name: 'Farfetch' }, { id: 4, name: 'Shopbop' }, { id: 5, name: 'Shein' }, { id: 6, name: 'TerminalX' }, { id: 7, name: 'Net-A-Porter' }];
  price = ['ALL PRICES', '>1000', '1000-5000', '<5000'];
  mainMenu: boolean = true;
  secondaryMenu = {};
  icon = 'menu';
  arrow_back = 'arrow_back_ios';
  onDestroy: Subject<void> = new Subject<void>();
  filteringDTO = new FilteringDTO();
  opened: boolean = false;
  currMenu: string;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches));
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  routes: Routes = [{ path: 'profile/:id', component: ViewProfileComponent }];
  items = Array.from({ length: 100000 }).map((_, i) => `Item #${i}`);
  constructor(
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private feedService: FeedService,
    private errorsService: ErrorsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.initFilteringDTO();
    this.searchForm = this.formBuilder.group({
      search: ['']
    })
    this.onChanges();
  }
  onChanges(): void {
    this.searchForm.controls['search'].valueChanges.pipe(takeUntil(this.onDestroy)).subscribe(val => {
      this.setSearchInput(val);
    })
  }

  public toggle(): void {
    console.log("in toggle");
    this.drawer.toggle();
  }

  currentMenu(menuItem) {
    this.mainMenu = false;
    this.showBack = true;
    switch (menuItem) {
      case 'categories':
        this.currMenu = 'cat';
        break;
      case 'designers':
        this.currMenu = 'des';
        break;
      case 'stores':
        this.currMenu = 'str';
        break;
    }
  }

  goBack() {
    if (this.currMenu == 'prd-clothings') {
      this.currMenu = 'cat';
    }
    else {
      this.mainMenu = true;
      this.currMenu = '';
    }
    this.initFilteringDTO();
    this.updateFeedFilteringDTO();
  }

  filterByCategory(item) {
    if (item == 'All Categories') {
      this.filteringDTO.category = null;
      return;
    }
    else {
      this.filteringDTO.category = item;
      if (item == 'Clothing') {
        this.currMenu = 'prd-clothings';
        this.mainMenu = true;
        this.updateFeedFilteringDTO();
        this.toggle();
      }
    }

  }

  initMenu() {
    this.toggle();
    this.currMenu = null;
    this.mainMenu = true;
  }

  filterByProduct(item) {
    this.filteringDTO.productTypes.push(item);
    this.updateFeedFilteringDTO();
    //this.initMenu();
  }

  filterByDesigner(item) {
    this.filteringDTO.designers.push(item);
    this.updateFeedFilteringDTO();
    this.initMenu();
  }

  filterByStore(id) {
    this.filteringDTO.stores.push(id);
    this.updateFeedFilteringDTO();
    this.initMenu();
  }

  updateFeedFilteringDTO() {
    if (this.activatedRoute.routeConfig.component.name == 'ViewFeedComponent') {
      this.feedService.timelinefeedFilteringDTO = this.filteringDTO;
      this.errorsService.sendMessage('update-timelinefeed');
    }
    if (this.activatedRoute.routeConfig.component.name == 'ViewProfileComponent') {
      this.feedService.userfeedFilteringDTO = this.filteringDTO;
      this.errorsService.sendMessage('update-userfeed');
    }
    if (this.activatedRoute.routeConfig.component.name == 'ViewExploreComponent') {
      this.feedService.explorefeedFilteringDTO = this.filteringDTO;
      this.errorsService.sendMessage('update-exlporefeed');
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

  initFilteringDTO() {
    this.filteringDTO.category = null;
    this.filteringDTO.productTypes = [];
    this.filteringDTO.designers = [];
    this.filteringDTO.stores = [];
    this.filteringDTO.minPrice = 0;
    this.filteringDTO.maxPrice = 0;
  }
}
