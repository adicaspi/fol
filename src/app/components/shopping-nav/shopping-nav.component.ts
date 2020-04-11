import { Component, OnInit, ViewChild, ChangeDetectionStrategy, HostListener, ElementRef } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { FeedService } from '../../services/feed.service';
import { ErrorsService } from '../../services/errors.service';
import { FilteringDTO } from '../../models/FilteringDTO';
import { MatSidenav } from '@angular/material';
import { MessageService } from '../../services/message.service';
import { SliderType } from "igniteui-angular";
import { ShoppingNavService } from '../../services/shopping-nav.service';
import * as jQuery from 'jquery';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/slider';
(window as any).jQuery = $;
require('jquery-ui-touch-punch');

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
  public sliderType = SliderType;
  public priceRange: PriceRange = new PriceRange(0, 2000);
  minValue: number = 0;
  maxValue: number = 2000;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private feedService: FeedService,
    private massageService: MessageService,
    private shoppingNavService: ShoppingNavService,
    private eRef: ElementRef
  ) {
  }

  ngOnInit() {
    this.initSlider();
    this.shoppingNavService.mobileMenu.map(val => this.menu.push(Object.assign({}, val)));
    this.shoppingNavService.clothing.map(val => this.clothings.push(Object.assign({}, val)));
    this.shoppingNavService.designers.map(val => this.designers.push(Object.assign({}, val)));
    this.shoppingNavService.stores.map(val => this.stores.push(Object.assign({}, val)));
    this.shoppingNavService.prices.map(val => this.prices.push(Object.assign({}, val)));
  }

  // @HostListener('window:scroll', ['$event'])
  // scrollHandler(event) {
  //   let currScrollPos: number = window.pageYOffset;
  //   if (currScrollPos > this.prevScrollPos) {
  //     if (this.sidenav.opened) {
  //       this.toggleSidenav();
  //     }
  //   }
  //   this.prevScrollPos = currScrollPos;
  // }

  onChangeCheckBox(key, elem) {
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
      //this.updateFeedFilteringDTO();
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
      //this.updateFeedFilteringDTO();
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
      //this.updateFeedFilteringDTO();
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

  initSlider() {
    console.log("in slider");
    var v = [18, 55];
    $("#slider").slider({
      range: true,
      min: 0,
      max: 100,
      values: v,
      slide: function (event, ui) {
        // if ((ui.values[1] - ui.values[0]) < 5) {
        //   return false;
        // }
        // $("#label-0").css('left', ui.values[0] + "%").text(ui.values[0]);
        // $("#label-1").css('left', ui.values[1] + "%").text(ui.values[1]);
      },
      create: function (event, ui) {

        // $("#label-0").css('left', v[0] + "%").text(v[0]);
        // $("#label-1").css('left', v[1] + "%").text(v[1]);
      }
    });
  }

  selectedPrice() {
    this.filteringDTO.setMinPrice(this.priceRange.lower);
    this.filteringDTO.setMaxPrice(this.priceRange.upper);
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  applyFilters() {
    this.selectedPrice();
    this.updateFeedFilteringDTO();
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
