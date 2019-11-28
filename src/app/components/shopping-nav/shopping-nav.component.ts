import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { FeedService } from '../../services/feed.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { takeUntil } from 'rxjs/operators';
import { ErrorsService } from '../../services/errors.service';
import * as $ from 'jquery';
import { GlobalVariable } from '../../../global';
import { ViewProfileComponent } from '../view-profile/view-profile.component';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { FilteringDTO } from '../../models/FilteringDTO';
import { MatSidenav } from '@angular/material';
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
    { id: 1, name: 'All Clothing', servername: 'Default', checked: false },
    { id: 2, name: 'Tops', servername: 'Tops', checked: false },
    { id: 3, name: 'Pants', servername: 'Pants', checked: false },
    { id: 4, name: 'Jackets & Coats', servername: 'JacketsOrCoats', checked: false },
    { id: 5, name: 'Shorts', servername: 'Shorts', checked: false },
    { id: 6, name: 'Lingerie', servername: 'Lingerie', checked: false },
    { id: 7, name: 'Dresses & Skirts', servername: 'DressesOrSkirts', checked: false }
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
  visible = false;
  panelOpenState = true;
  openCloseStores = false;
  openCloseDesigners = false;
  seeMoreDesigners = 'see more+';
  seeMoreStores = 'see more+';
  seeMoreFilters = '+filters';
  currSelectedPrice;
  prevSelectedPrice;
  currSelectedProductType;
  prevSelectedProductType;
  productIsSelected: boolean = false;
  priceIsSelected: boolean = false;
  filteringChanged: boolean = false;
  showProductType: boolean = false;

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


    this.searchForm = this.formBuilder.group({
      search: ['']
    })
    this.onChanges();
  }
  onChanges(): void {
    this.searchForm.controls['search'].valueChanges.pipe(takeUntil(this.onDestroy)).subscribe(value => {
      if (value != "") {
        this.getSearchResults(value);
      }
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
          this.filteringChanged = true;
        }
        else {
          this.currSelectedPrice = elem;
          this.prevSelectedPrice = elem;
          this.priceIsSelected = true;
        }
        this.filteringDTO.setMaxPrice(this.currSelectedPrice.value);
      } else {
        this.priceIsSelected = false
        elem.checked = false;
        this.filteringDTO.setMaxPrice(0);
        this.filteringChanged = false;
      }
      this.updateFeedFilteringDTO();
    }
    if (key == "stores") {
      if ($event.checked == true) {
        elem.checked = true;
        this.filteringDTO.setStores(elem);
        this.filteringChanged = true;

      }
      else {
        elem.checked = false;
        this.filteringDTO.removeStore(elem);
        if (this.filteringDTO.getStores().length == 0) {
          this.filteringChanged = false;
        }
      }
      this.updateFeedFilteringDTO();
    }
    if (key == "desginers") {
      if ($event.checked == true) {
        elem.checked = true;
        this.filteringDTO.setDesigners(elem);
        this.filteringChanged = true;
      }
      else {
        elem.checked = false;
        const index = this.filteringDTO.removeDesigner(elem);
        if (this.filteringDTO.designers.length == 0) {
          this.filteringChanged = false;
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
    this.filteringDTO = new FilteringDTO();
    this.updateFeedFilteringDTO();

  }

  public toggle(): void {
    console.log("in toggle");
    this.drawer.toggle();
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
    if (item == 'Clothing') {
      this.showProductType = true;
    }
    else {
      this.showProductType = false;
    }
    this.filteringDTO.category = item;
    this.updateFeedFilteringDTO();
  }
  closeProductType() {
    this.showProductType = false;
    this.filteringDTO.removeProductType();
    this.filteringDTO.setCategory(null);
    if (this.productIsSelected) {
      this.updateFeedFilteringDTO();
      this.currSelectedProductType.checked = false;
      this.prevSelectedProductType.checked = false;
      this.currSelectedProductType = null;
      this.prevSelectedProductType = null;
    }
  }

  feedPage() {
    this.router.navigate(['feed', this.userService.userId]);
  }

  initMenu() {
    this.toggle();
    this.currMenu = null;
    this.mainMenu = true;
  }

  filterByProduct(elem) {
    this.filteringDTO.productTypes = [];

    if (this.productIsSelected) {
      if (this.prevSelectedProductType == elem) {
        this.productIsSelected = false;
        this.prevSelectedProductType = null;
        this.currSelectedProductType = null;
        elem.checked = false;
      }
      else {
        this.currSelectedProductType = elem;
        elem.checked = true;
        this.prevSelectedProductType.checked = false;
        this.prevSelectedProductType = this.currSelectedProductType;
        if (elem.servername != 'Default') {
          this.filteringDTO.setProductTypes(elem);
        }
      }
    }
    else {
      elem.checked = true;
      this.currSelectedProductType = elem;
      this.prevSelectedProductType = elem;
      this.productIsSelected = true;
      if (elem.servername != 'Default') {
        this.filteringDTO.setProductTypes(elem);
      }
    }
    this.updateFeedFilteringDTO();
  }




  updateFeedFilteringDTO() {
    this.feedService.offset = 0;
    if (this.activatedRoute.routeConfig.component.name == 'ViewFeedComponent') {
      this.feedService.timelinefeedFilteringDTO = this.filteringDTO.getFilteringDTO();
      this.errorsService.sendMessage('update-timelinefeed');
    }
    if (this.activatedRoute.routeConfig.component.name == 'ViewProfileComponent') {
      this.feedService.userfeedFilteringDTO = this.filteringDTO.getFilteringDTO();
      this.errorsService.sendMessage('update-userfeed');
    }
    if (this.activatedRoute.routeConfig.component.name == 'ViewExploreComponent') {
      this.feedService.explorefeedFilteringDTO = this.filteringDTO.getFilteringDTO();
      this.errorsService.sendMessage('update-exlporefeed');
    }
  }

  getSearchResults(value: string) {
    let baseAPI = this.baseApiUrl + '/image?s3key=';
    this.userService.search(value).subscribe(res => {
      this.options = [];
      res.forEach(element => {
        let searchObject = {
          fullName: element.fullName,
          userName: element.username,
          profileImgSrc: baseAPI + element.userProfileImageAddr,
          id: element.id
        };
        this.options.push(searchObject);
      })
      //this.filteredOptions = this._filter(value);
    })
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
    this.filteringDTO.category = 'Clothing';
    this.filteringDTO.productTypes = [];
    this.filteringDTO.designers = [];
    this.filteringDTO.stores = [];
    this.filteringDTO.minPrice = 0;
    this.filteringDTO.maxPrice = 0;
  }
}
