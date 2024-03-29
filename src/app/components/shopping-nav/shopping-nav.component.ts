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
import { first } from '../../../../node_modules/rxjs-compat/operator/first';
import { Router } from '../../../../node_modules/@angular/router';
import { ConfigService } from '../../services/config.service';

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
  componentName: ComponentName;

  priceMinValue: string = "0";
  priceMaxValue: string = "1800+";
  priceMinValueInt: number = 0;
  priceMaxValueInt: number = 1800;
  priceMinDiff: number = 100;

  constructor(
    private feedService: FeedService,
    private massageService: MessageService,
    private router: Router,
    private configService: ConfigService

  ) {
    let region = this.configService.getUserRegion("region") as string;
    this.filteringDTO.region = region;
  }

  ngOnInit() {
    if (this.router.url.includes("feed") || this.router.url == "/") {
      this.componentName = ComponentName.Feed;
      this.filteringDTO.setFilteringDTO(this.feedService.feedFilteringDTO.getFilteringDTO());
    } if (this.router.url.includes("profile")) {
      this.componentName = ComponentName.Profile;
      this.filteringDTO.setFilteringDTO(this.feedService.profileFilteringDTO.getFilteringDTO());
    } if (this.router.url.includes("explore")) {
      this.componentName = ComponentName.Explore;
      this.filteringDTO.setFilteringDTO(this.feedService.exploreFilteringDTO.getFilteringDTO());
    }
    if (this.router.url.includes("general")) {
      this.componentName = ComponentName.GeneralExplore;
      this.filteringDTO.setFilteringDTO(this.feedService.exploreGeneralFilteringDTO.getFilteringDTO());
    }
    this.filteringDTO.setAllCheckedButtons();


    if (this.filteringDTO.categoryIsFiltered) {
      this.showProductType = true;
    }
    this.initSlider(this);
    // this.setMaxPriceAndSlider(this.filteringDTO.getMaxPrice());
    // this.setMinPriceAndSlider(this.filteringDTO.getMinPrice());
    this.updateFeedFilteringDTO();
    this.menu = [{ id: 1, name: 'All', checked: true }, { id: 2, name: 'Clothing', checked: false }, { id: 3, name: 'Shoes', checked: false }, { id: 4, name: 'Bags', checked: false }, { id: 5, name: 'Accessories', checked: false }];
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
    this.filteringDTO.clearProductType();
    this.filteringDTO.clearDesigners();
    this.filteringDTO.clearStores();
    this.setMaxPriceAndSlider(this.priceMaxValueInt);
    this.setMinPriceAndSlider(this.priceMinValueInt);
  }

  clearSideFiltersSelectionNoUpdate() {
    this.filteringDTO.clearProductType();
    this.filteringDTO.clearDesigners();
    this.filteringDTO.clearStores();
  }

  sidenavOpened() {
    this.filteringChanged = false;

  }

  sidenavClosed() {
    this.filteringDTO.minPrice = this.getMinPriceValue();
    this.filteringDTO.maxPrice = this.getMaxPriceValue();
    // if ((this.filteringDTO.menuIsFiltered) && (this.filteringChanged)) {
    if (this.filteringChanged) {
      this.updateFeedFilteringDTO();

    }
    //}
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
    let prevItem = this.menu[this.currCategory];
    prevItem.checked = false;
    item.checked = true;
    this.currCategory = item.id - 1;
    this.showProductType = (item && item.name.toLowerCase() === 'all categories');
    if (item.name == "All Categories") {
      this.filteringDTO.setCategory(null);
    }
    else {
      this.filteringDTO.setCategory(item.name);
    }
    this.updateFeedFilteringDTO();
  }

  updateFeedFilteringDTO() {
    this.feedService.offset = 0;
    if (this.componentName == ComponentName.Feed) {
      this.feedService.feedFilteringDTO.setFilteringDTO(this.filteringDTO.getFilteringDTO());
    }
    if (this.componentName == ComponentName.Profile) {
      this.feedService.profileFilteringDTO.setFilteringDTO(this.filteringDTO.getFilteringDTO());
    }
    if (this.componentName == ComponentName.Explore) {
      this.feedService.exploreFilteringDTO.setFilteringDTO(this.filteringDTO.getFilteringDTO());
    }
    if (this.componentName == ComponentName.GeneralExplore) {
      this.feedService.exploreGeneralFilteringDTO.setFilteringDTO(this.filteringDTO.getFilteringDTO());
    }
    this.massageService.sendMessage('update-feed');
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
    this.setSliderMin(minIntValue);
    this.selectedPrice(minIntValue, maxIntValue);
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
    this.setSliderMax(maxIntValue);
    this.selectedPrice(minIntValue, maxIntValue);
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
    this.filteringChanged = true;
    this.filteringDTO.priceIsFiltered = true;
    if (minPrice == 0 && maxPrice >= 1800) {
      this.wasFilteredAndCleared = true;
      this.filteringDTO.priceIsFiltered = false;
    }
    //if (minPrice > 0) {
    this.filteringDTO.setMinPrice(minPrice);
    //}
    if (maxPrice == this.priceMaxValueInt) {
      this.filteringDTO.setMaxPrice(0);
    } else {
      this.filteringDTO.setMaxPrice(maxPrice);
    }
  }
}

class PriceRange {
  constructor(
    public lower: number,
    public upper: number
  ) {
  }
}

enum ComponentName {
  Feed,
  Profile,
  MainProfile,
  Explore,
  GeneralExplore
}
