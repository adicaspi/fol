import { Component, OnInit, Output, EventEmitter, ViewEncapsulation, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as $ from 'jquery';
import { MatRadioChange, MatRadioButton, MatMenuTrigger, MatCheckboxChange } from '@angular/material';
import { Options, LabelType } from 'ng5-slider';
import { Ng5SliderModule } from 'ng5-slider';
import { SliderType } from "igniteui-angular";
import { FilteringDTO } from '../../models/FilteringDTO';
import { FeedService } from '../../services/feed.service';
import { ErrorsService } from '../../services/errors.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { ShoppingNavService } from '../../services/shopping-nav.service';

@Component({
  selector: 'app-mutual-nav',
  templateUrl: './mutual-nav.component.html',
  styleUrls: ['./mutual-nav.component.css'],

})
export class MutualNavComponent implements OnInit {
  @Output()
  change: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild(MatMenuTrigger, { static: false }) categoryController: MatMenuTrigger;
  @ViewChildren(MatMenuTrigger) trigger: QueryList<MatMenuTrigger>;
  public sliderType = SliderType;
  public priceRange: PriceRange = new PriceRange(0, 5000);
  minValue: number = 0;
  maxValue: number = 5000;
  categoryForm: FormGroup;
  productForm: FormGroup;
  categroyRadioButton: MatRadioButton = null;
  allCategroiesRadioButton: MatRadioButton = null;
  showProduct: boolean = false;
  filteringDTO = new FilteringDTO();
  menuChanged: boolean = false;
  categories = [];
  clothing = [];
  designers = [];
  stores = [];
  productsToShow = [];


  constructor(private formBuilder: FormBuilder, private feedService: FeedService, private massageService: MessageService, private activatedRoute: ActivatedRoute, private shoppingNavService: ShoppingNavService) { }

  ngOnInit() {
    this.categories = this.shoppingNavService.desktopMenu;
    this.clothing = this.shoppingNavService.clothing;
    this.designers = this.shoppingNavService.designers;
    this.stores = this.shoppingNavService.stores;


    this.categoryForm = this.formBuilder.group({
      category: ['']
    });
    this.productForm = this.formBuilder.group({
      Clothings: [''],
      Shoes: [''],
      Bags: [''],
      Accesories: ['']
    });
  }

  menuClosed() {
    if (this.menuChanged) {
      this.updateFeedFilteringDTO();
      this.menuChanged = false;
    }
  }

  menuOpened() {

  }

  categoryValue() {
    let val = this.categoryForm.get('category');
  }

  clearCategoryForm() {
    if (this.categroyRadioButton) {
      this.categroyRadioButton.checked = false;
    }
  }

  onChange(mrChange: MatRadioChange) {
    this.filteringDTO.setCategory(mrChange.value);
    if (mrChange.source.id.toString() != '1') {
      this.showProduct = true;
      switch (mrChange.value) {
        case "Clothing":
          this.productsToShow = this.clothing;
          break;
      }
    } else {
      this.filteringDTO.setCategory(null);
      this.showProduct = false;
      this.filteringDTO.clearProductType();
    }
    this.updateFeedFilteringDTO();
  }

  onChangeCheckBox(key, $event, elem) {
    this.menuChanged = true;
    if ($event.checked == true) {
      elem.checked = true;
      this.filtering(key, elem, true);
    }
    else {
      elem.checked = false;
      this.filtering(key, elem, false)
    }
  }

  filtering(key, elem, checked) {
    switch (key) {
      case "products":
        if (checked) {
          this.filteringDTO.setProductTypes(elem);
        }
        else {
          this.filteringDTO.removeProduct(elem);
        }
        break;
      case "designers":
        if (checked) {
          this.filteringDTO.setDesigners(elem);
        }
        else {
          this.filteringDTO.removeDesigner(elem);
        }
        break;
      case "stores":
        if (checked) {
          this.filteringDTO.setStores(elem);
        }
        else {
          this.filteringDTO.removeStore(elem);
        }
        break;
    }
  }

  selectedProduct() {
  }

  selectedStore() {
  }

  selectedDesigner() {
  }

  selectedPrice() {
    this.filteringDTO.setMinPrice(this.priceRange.lower);
    this.filteringDTO.setMaxPrice(this.priceRange.upper);
  }

  clearSelection(arrayToIterrate, filteringDTOarray) {
    arrayToIterrate.forEach(elem => {
      elem.checked = false;
    })
    switch (filteringDTOarray) {
      case "productTypes":
        this.filteringDTO.clearProductType();
        break;
      case "designers":
        this.filteringDTO.clearDesigners();
        break;
      case "stores":
        this.filteringDTO.clearStores();
    }
    this.menuChanged = true;
    this.menuClosed();
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