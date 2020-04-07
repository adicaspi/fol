import { Component, OnInit, ViewChild, ChangeDetectionStrategy, HostListener, ElementRef } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { FeedService } from '../../services/feed.service';
import { ErrorsService } from '../../services/errors.service';
import { FilteringDTO } from '../../models/FilteringDTO';
import { MatSidenav } from '@angular/material';
import { MessageService } from '../../services/message.service';
import { SliderType } from "igniteui-angular";
import * as jquery from 'jquery';

@Component({
  selector: 'app-shopping-nav',
  templateUrl: './shopping-nav.component.html',
  styleUrls: ['./shopping-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShoppingNavComponent implements OnInit {
  @ViewChild('sidenav', { static: false }) public sidenav: MatSidenav;
  placeholder = "search &#xF002";
  menu = [{ id: 1, name: 'All', checked: true }, { id: 2, name: 'Clothing', checked: false }, { id: 3, name: 'Shoes', checked: false }, { id: 4, name: 'Bags', checked: false }, { id: 5, name: 'Accessories', checked: false }];
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
  stores = [{ id: 1, name: 'Asos', checked: false }, { id: 8, name: 'Zara', checked: false }, { id: 3, name: 'Farfetch', checked: false }, { id: 6, name: 'Shopbop', checked: false }, { id: 5, name: 'Shein', checked: false }, { id: 7, name: 'TerminalX', checked: false }, { id: 2, name: 'Net-A-Porter', checked: false }];
  prices = [{ value: 100, checked: false }, { value: 200, checked: false }, { value: 300, checked: false }, { value: 400, checked: false }, { value: 500, checked: false }];
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
  public sliderType = SliderType;
  public priceRange: PriceRange = new PriceRange(0, 5000);
  minValue: number = 0;
  maxValue: number = 5000;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private feedService: FeedService,
    private massageService: MessageService,
  ) {
  }

  ngOnInit() { }

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

class PriceRange {
  constructor(
    public lower: number,
    public upper: number
  ) {
  }
}
