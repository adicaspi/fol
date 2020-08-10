import { Component, OnInit, ViewChild, ChangeDetectionStrategy, HostListener, ElementRef } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { FeedService } from '../../services/feed.service';
import { ErrorsService } from '../../services/errors.service';
import { FilteringDTO } from '../../models/FilteringDTO';
import { MatSidenav, throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { MessageService } from '../../services/message.service';
import { SliderType } from "igniteui-angular";
import { ShoppingNavService } from '../../services/shopping-nav.service';
import * as jQuery from 'jquery';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/slider';
(window as any).jQuery = $;
require('jquery-ui-touch-punch');
declare var setInputFilter: any;
import '../../shared/input-filter.js'

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
  wasFilteredAndCleared: boolean = false;
  prevScrollPos = window.pageYOffset;
  public sliderType = SliderType;
  public priceRange: PriceRange = new PriceRange(0, 2000);

  priceMinValue: string = "0";
  priceMaxValue: string = "1800+";
  priceMinValueInt: number = 0;
  priceMaxValueInt: number = 1800;
  priceMinDiff: number = 100;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private feedService: FeedService,
    private massageService: MessageService,
    private shoppingNavService: ShoppingNavService,
    private eRef: ElementRef
  ) {
  }

  ngOnInit() {
    this.initSlider(this);
    this.shoppingNavService.mobileMenu.map(val => this.menu.push(Object.assign({}, val)));
    this.shoppingNavService.clothing.map(val => this.clothings.push(Object.assign({}, val)));
    this.shoppingNavService.designers.map(val => this.designers.push(Object.assign({}, val)));
    this.shoppingNavService.stores.map(val => this.stores.push(Object.assign({}, val)));
    this.shoppingNavService.prices.map(val => this.prices.push(Object.assign({}, val)));
  }

  onChangeCheckBox(key, elem) {
    if (key === 'stores') {
      if (!elem.checked) {
        elem.checked = true;
        this.filteringDTO.setStores(elem);
        this.filteringChanged = true;
      } else {
        elem.checked = false;
        this.filteringDTO.removeStore(elem);
        this.wasFilteredAndCleared = true;
      }
    }
    if (key === 'designers') {
      if (!elem.checked) {
        elem.checked = true;
        this.filteringDTO.setDesigners(elem);
        this.filteringChanged = true;
      } else {
        elem.checked = false;
        this.filteringDTO.removeDesigner(elem);
        this.wasFilteredAndCleared = true;
      }
    }
    if (key === 'clothings') {
      if (!elem.checked) {
        elem.checked = true;
        this.filteringDTO.setProductTypes(elem);
        this.filteringChanged = true;
      } else {
        elem.checked = false;
        this.filteringDTO.removeProduct(elem);
        this.wasFilteredAndCleared = true;
      }
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
    if (this.filteringDTO.menuIsFiltered) {
      this.wasFilteredAndCleared = true;
    }
    this.designers.forEach(elem => {
      if (elem.checked) {
        this.filteringDTO.removeDesigner(elem);
        elem.checked = false;
      }

    });
    this.stores.forEach(elem => {
      if (elem.checked) {
        this.filteringDTO.removeStore(elem);
        elem.checked = false;
      }
    });
    this.clothings.forEach(elem => {
      if (elem.checked) {
        this.filteringDTO.removeProduct(elem);
        elem.checked = false;
      }
    });
    this.setMaxPriceAndSlider(this.priceMaxValueInt);
    this.setMinPriceAndSlider(this.priceMinValueInt);
    this.filteringDTO = new FilteringDTO();
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

  initSlider(that) {

    setInputFilter(document.getElementById("max-price"), function (value) {
      return /^\d*$/.test(value) || value == that.priceMaxValue;
    });

    setInputFilter(document.getElementById("min-price"), function (value) {
      return /^\d*$/.test(value);
    });

    var v = [0, 1800];
    $("#slider").slider({
      range: true,
      min: 0,
      max: 1800,
      values: v,
      stop: function (event, ui) {
        that.selectedPrice(ui.values[0], ui.values[1]);
      },
      slide: function (event, ui) {

        if (ui.values[1] - ui.values[0] < that.priceMinDiff) {
          return false;
        }

        that.setMinPrice(ui.values[0]);
        that.setMaxPrice(ui.values[1]);

      }
    });
  }

  /* set min-max helpers */

  setMaxPrice(maxPrice: number) {
    let maxPriceString = maxPrice.toString();
    if (maxPrice >= this.priceMaxValueInt) {
      maxPriceString = this.priceMaxValue;
    }
    $("#max-price").val(maxPriceString);
  }

  setMinPrice(minPrice: number) {
    let minPriceString = minPrice.toString();
    if (minPrice < 0) {
      minPriceString = this.priceMinValue;
    }
    if (minPrice >= this.priceMaxValueInt) {
      minPriceString = this.priceMaxValueInt.toString();
    }
    $("#min-price").val(minPriceString);
  }

  setMaxPriceAndSlider(maxPrice: number) {
    this.setMaxPrice(maxPrice);
    this.setSliderMax(maxPrice);
  }

  setSliderMax(maxValue: number) {
    $("#slider").slider("values", 1, maxValue);
  }

  setMinPriceAndSlider(minPrice: number) {
    this.setMinPrice(minPrice);
    this.setSliderMin(minPrice);
  }

  setSliderMin(minValue: number) {
    $("#slider").slider("values", 0, minValue);
  }

  getMinPriceValue() {
    return $("#slider").slider("values", 0);
  }

  getMaxPriceValue() {
    let sliderValue = $("#slider").slider("values", 1);
    let inputValue = $("#max-price").val();
    if (inputValue == this.priceMaxValue) {
      return 0;
    }
    return sliderValue;
  }

  changeMaxPriceInput() {
    let stringMinValue = $("#min-price").val();
    let stringMaxValue = $("#max-price").val();
    let minIntValue = parseInt(stringMinValue);
    let maxIntValue = parseInt(stringMaxValue);

    //if input fields empty it means input = 0
    if (stringMaxValue == "") {
      maxIntValue = 0;
    }

    // if max input field < min input field
    // make sure the max slider remains to the right of the left slider
    if (maxIntValue < minIntValue + this.priceMinDiff) {
      maxIntValue = Math.min(minIntValue + this.priceMinDiff, this.priceMaxValueInt);
    }

    this.setSliderMax(maxIntValue);
  }

  changeMinPriceInput() {
    let stringMinValue = $("#min-price").val();
    let stringMaxValue = $("#max-price").val();
    let minIntValue = parseInt(stringMinValue);
    let maxIntValue = parseInt(stringMaxValue);

    //if input fields empty it means input = 0
    if (stringMinValue == "") {
      minIntValue = 0;
    }

    if (minIntValue > maxIntValue - this.priceMinDiff) {
      this.setMaxPriceAndSlider(minIntValue + this.priceMinDiff);
    }

    this.setSliderMin(minIntValue);
  }

  maxPriceUnfocus() {

    //set border color
    $("#max-price").parent().css("border-color", "rgb(205,205,205)");

    let stringMinValue = $("#min-price").val();
    let stringMaxValue = $("#max-price").val();
    let minIntValue = parseInt(stringMinValue);
    let maxIntValue = parseInt(stringMaxValue);

    // if user left input field empty set input field and slider to max value
    if (!maxIntValue) {
      this.setMaxPriceAndSlider(this.priceMaxValueInt);
      return;
    }

    if (maxIntValue < minIntValue + this.priceMinDiff) {
      this.setMinPriceAndSlider(maxIntValue - this.priceMinDiff);
    }

    this.setMaxPriceAndSlider(maxIntValue);
  }

  minPriceUnfocus() {

    //set border color
    $("#min-price").parent().css("border-color", "rgb(205,205,205)");

    let stringMinValue = $("#min-price").val();
    let stringMaxValue = $("#max-price").val();
    let minIntValue = parseInt(stringMinValue);
    let maxIntValue = parseInt(stringMaxValue);

    if (!minIntValue) {
      this.setMinPriceAndSlider(this.priceMinValueInt);
      return;
    }

    this.setMinPriceAndSlider(minIntValue);
  }

  maxPriceFocus() {
    $("#max-price").parent().css("border-color", "#333");
  }

  minPriceFocus() {
    $("#min-price").parent().css("border-color", "#333");
  }

  selectedPrice(minPrice, maxPrice) {
    this.filteringDTO.setMinPrice(minPrice);
    if (maxPrice == this.priceMaxValueInt) {
      this.filteringDTO.setMaxPrice(0);
    } else {
      this.filteringDTO.setMaxPrice(maxPrice);
    }
  }

  sidenavClosed() {
    this.filteringDTO.minPrice = this.getMinPriceValue();
    this.filteringDTO.maxPrice = this.getMaxPriceValue();
    if (this.filteringDTO.menuIsFiltered) {
      this.updateFeedFilteringDTO();
    }
    if (this.wasFilteredAndCleared) {
      this.wasFilteredAndCleared = false;
      this.updateFeedFilteringDTO();
    }
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  applyFilters() {
    this.toggleSidenav();
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
