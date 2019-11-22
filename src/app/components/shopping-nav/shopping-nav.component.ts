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
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-shopping-nav',
  templateUrl: './shopping-nav.component.html',
  styleUrls: ['./shopping-nav.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 1, width: '150px' }),
        animate('1000ms ease-in', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ]),
    trigger('expandCollapse', [
      state('open', style({
        'height': '*'
      })),
      state('close', style({
        'height': '0px'
      })),
      transition('open <=> close', animate(1000))
    ])
  ],
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
  mainList = ['Categories', 'Designers', 'Stores', 'Price'];
  originalList = {};
  displayList = {};
  categories = [{ id: 1, name: 'All Categories' }, { id: 2, name: 'Clothing' }, { id: 3, name: 'Shoes' }, { id: 4, name: 'Bags' }, { id: 5, name: 'Accessories' }];
  clothings = [
    { id: 1, name: 'All Clothings', servername: 'Default' },
    { id: 2, name: 'Tops', servername: 'Tops' },
    { id: 3, name: 'Pants', servername: 'Pants' },
    { id: 4, name: 'Jackets & Coats', servername: 'JacketsOrCoats' },
    { id: 5, name: 'Shorts', servername: 'Shorts' },
    { id: 6, name: 'Lingerie', servername: 'Lingerie' },
    { id: 7, name: 'Dresses & Skirts', servername: 'DressesOrSkirts' }
  ];
  designers = [{ id: 1, name: 'Gucci', checked: false }, { id: 2, name: 'Prada', checked: false }, { id: 3, name: 'D&G', checked: false }, { id: 4, name: 'Isabel Marant', checked: false }, { id: 5, name: 'Loewe', checked: false }, { id: 6, name: 'Saint Laurent', checked: false }, { id: 7, name: 'Celine', checked: false }, { id: 8, name: 'Givenchy', checked: false }, { id: 9, name: 'Fendi', checked: false }];
  stores = [{ id: 1, name: 'ASOS', checked: false }, { id: 8, name: 'ZARA', checked: false }, { id: 3, name: 'Farfetch', checked: false }, { id: 6, name: 'Shopbop', checked: false }, { id: 5, name: 'Shein', checked: false }, { id: 7, name: 'TerminalX', checked: false }, { id: 2, name: 'Net-A-Porter', checked: false }];
  prices = [{ value: 100, checked: false }, { value: 200, checked: false }, { value: 300, checked: false }, { value: 400, checked: false }, { value: 500, checked: false }];
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
  visible = false;
  panelOpenState = true;
  openCloseStores = false;
  openCloseDesigners = false;
  seeMoreDesigners = 'see more+';
  seeMoreStores = 'see more+';
  seeMoreFilters = '+filters';
  currSelectedPrice;
  prevSelectedPrice;
  priceIsSelected: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private feedService: FeedService,
    private errorsService: ErrorsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.visible = false;
  }

  ngOnInit() {
    this.initFilteringDTO();
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

  onChangeCheckBox(key, $event, elem) {
    if (key == 'prices') {

      if ($event.checked == true) {
        elem.checked = true;
        if (this.priceIsSelected) {
          this.currSelectedPrice = elem;
          this.prevSelectedPrice.checked = false;
          this.prevSelectedPrice = this.currSelectedPrice;
        }
        else {
          this.currSelectedPrice = elem;
          this.prevSelectedPrice = elem;
          this.priceIsSelected = true;
        }
        this.filteringDTO.maxPrice = this.currSelectedPrice.value;
      } else {
        this.priceIsSelected = false
        elem.checked = false;
        this.filteringDTO.maxPrice = 0;
      }
      this.updateFeedFilteringDTO();
    }
    if (key == "stores") {
      if ($event.checked == true) {
        elem.checked = true;
        this.filteringDTO.stores.push(elem.id);
      }
      else {
        const index = this.filteringDTO.stores.indexOf(elem.id, 0);
        if (index > -1) {
          this.filteringDTO.stores.splice(index, 1);
        }
      }
      this.updateFeedFilteringDTO();
    }
    if (key == "desginers") {
      if ($event.checked == true) {
        elem.checked = true;
        this.filteringDTO.designers.push(elem.name);
      }
      else {
        const index = this.filteringDTO.designers.indexOf(elem.name, 0);
        if (index > -1) {
          this.filteringDTO.productTypes.splice(index, 1);
        }
      }
      this.updateFeedFilteringDTO();
    }

  }

  openReportsFilter(category): void {
    if (category == 'designers') {
      this.openCloseDesigners = !this.openCloseDesigners;
      if (this.openCloseDesigners) {
        this.seeMoreDesigners = 'see less-';
      }
      else {
        this.seeMoreDesigners = 'see more+';
      }

    }
    if (category == 'stores') {
      this.openCloseStores = !this.openCloseStores;
      if (this.openCloseStores) {
        this.seeMoreStores = 'see less-';
      }
      else {
        this.seeMoreStores = 'see more+';
      }

    }
  }

  toggleRightSide() {
    this.visible = !this.visible;
    if (this.visible) {
      this.seeMoreFilters = '-filtres';
    }
    else {
      this.seeMoreFilters = '+filters';
    }
  }

  clearSelection() {
    this.designers.forEach(elem => {
      elem.checked = false;
    });
    this.stores.forEach(elem => {
      elem.checked = false;
    });
    this.filteringDTO.designers = [];
    this.filteringDTO.stores = [];
    this.filteringDTO.maxPrice = 0;
    this.filteringDTO.minPrice = 0;

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
    this.toggle();
  }

  filterByCategory(item) {
    if (item == 'All Categories') {
      this.initFilteringDTO();
      this.initMenu();
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
    this.filteringDTO.productTypes = [];
    if (item != 'Default') {
      this.filteringDTO.productTypes.push(item);
    }
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
