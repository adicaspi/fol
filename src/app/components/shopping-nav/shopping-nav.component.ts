import { Component, OnInit, ViewChild, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { FeedService } from '../../services/feed.service';
import { ErrorsService } from '../../services/errors.service';
import { FilteringDTO } from '../../models/FilteringDTO';
import { MatSidenav } from '@angular/material';
import { MessageService } from '../../services/message.service';
import * as jquery from 'jquery';
import { ShoppingNavService } from '../../services/shopping-nav.service';

@Component({
  selector: 'app-shopping-nav',
  templateUrl: './shopping-nav.component.html',
  styleUrls: ['./shopping-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShoppingNavComponent implements OnInit {
  @ViewChild('sidenav', { static: false }) public sidenav: MatSidenav;
  placeholder = "search &#xF002";
  menu = [];
  clothings = [];
  designers = [];
  stores = [];
  prices = [];
  onDestroy: Subject<void> = new Subject<void>();
  filteringDTO = new FilteringDTO();
  openCloseStores = true;
  openCloseDesigners = true;
  openCloseProducts = true;
  currSelectedPrice;
  prevSelectedPrice;
  currCategory: number = 0;
  priceIsSelected: boolean = false;
  filteringChanged: boolean = false;
  showProductType: boolean = true;
  prevScrollPos = window.pageYOffset;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private feedService: FeedService,
    private massageService: MessageService,
    private shoppingNavService: ShoppingNavService
  ) {
  }

  ngOnInit() {
    this.shoppingNavService.mobileMenu.map(val => this.menu.push(Object.assign({}, val)));
    this.shoppingNavService.clothing.map(val => this.clothings.push(Object.assign({}, val)));
    this.shoppingNavService.designers.map(val => this.designers.push(Object.assign({}, val)));
    this.shoppingNavService.stores.map(val => this.stores.push(Object.assign({}, val)));
    this.shoppingNavService.prices.map(val => this.prices.push(Object.assign({}, val)));
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    let currScrollPos: number = window.pageYOffset;
    if (currScrollPos > this.prevScrollPos) {
      if (this.sidenav.opened) {
        this.toggleSidenav();
      }
    }
    this.prevScrollPos = currScrollPos;
  }

  onChangeCheckBox(key, elem) {
    if (key === 'prices') {
      if (!elem.checked) {
        elem.checked = true;
        if (this.priceIsSelected) {
          this.currSelectedPrice = elem;
          this.prevSelectedPrice.checked = false;
          this.prevSelectedPrice = this.currSelectedPrice;
          this.filteringChanged = true;
        } else {
          this.currSelectedPrice = elem;
          this.prevSelectedPrice = elem;
          this.priceIsSelected = true;
        }
        this.filteringDTO.setMaxPrice(this.currSelectedPrice.value);
      } else {
        this.priceIsSelected = false;
        elem.checked = false;
        this.filteringDTO.setMaxPrice(0);
        this.filteringChanged = false;
      }
      this.updateFeedFilteringDTO();
    }
    if (key === 'stores') {
      if (!elem.checked) {
        elem.checked = true;
        this.filteringDTO.setStores(elem);
        this.filteringChanged = true;
      } else {
        elem.checked = false;
        this.filteringDTO.removeStore(elem);
        if (this.filteringDTO.getStores().length === 0) {
          this.filteringChanged = false;
        }
      }
      this.updateFeedFilteringDTO();
    }
    if (key === 'designers') {
      if (!elem.checked) {
        elem.checked = true;
        this.filteringDTO.setDesigners(elem);
        this.filteringChanged = true;
      } else {
        elem.checked = false;
        const index = this.filteringDTO.removeDesigner(elem);
        if (this.filteringDTO.designers.length === 0) {
          this.filteringChanged = false;
        }
      }
      this.updateFeedFilteringDTO();
    }
    if (key === 'clothings') {
      if (!elem.checked) {
        elem.checked = true;
        this.filteringDTO.setProductTypes(elem);
        this.filteringChanged = true;
      } else {
        elem.checked = false;
        const index = this.filteringDTO.removeProduct(elem);
        if (this.filteringDTO.productTypes.length === 0) {
          this.filteringChanged = false;
        }
      }
      this.updateFeedFilteringDTO();
    }
  }

  onSeeMoreSideFilters(category): void {
    if (category === 'clothings') {
      this.openCloseProducts = !this.openCloseProducts;
    }

    if (category === 'designers') {
      this.openCloseDesigners = !this.openCloseDesigners;
    }

    if (category === 'stores') {
      this.openCloseStores = !this.openCloseStores;
    }
  }

  clearSideFiltersSelection() {
    this.designers.forEach(elem => {
      elem.checked = false;
    });
    this.stores.forEach(elem => {
      elem.checked = false;
    });
    this.clothings.forEach(elem => {
      elem.checked = false;
    });
    this.filteringDTO = new FilteringDTO();
    this.updateFeedFilteringDTO();
  }

  clearSideFiltersSelectionNoUpdate() {
    this.designers.forEach(elem => {
      elem.checked = false;
    });
    this.stores.forEach(elem => {
      elem.checked = false;
    });
    this.clothings.forEach(elem => {
      elem.checked = false;
    });
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  filterByCategory(item) {
    if (this.sidenav.opened) {
      this.toggleSidenav();
    }
    this.clearSideFiltersSelectionNoUpdate();
    this.filteringDTO = new FilteringDTO();
    let prevItem = this.menu[this.currCategory];
    prevItem.checked = false;
    item.checked = true;
    this.currCategory = item.id - 1;
    this.showProductType = (item && item.name.toLowerCase() === 'clothing');
    if (item.name == "All") {
      this.filteringDTO.category = "Clothing";
    }
    else {
      this.filteringDTO.category = item.name;
    }
    this.updateFeedFilteringDTO();
  }

  updateFeedFilteringDTO() {
    this.feedService.offset = 0;
    this.feedService.feedFilteringDTO = this.filteringDTO;
    this.massageService.sendMessage('update-feed');
    this.massageService.clearMessage();
  }
}
