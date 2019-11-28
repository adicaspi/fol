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

@Component({
  selector: 'app-mutual-nav',
  templateUrl: './mutual-nav.component.html',
  styleUrls: ['./mutual-nav.component.css'],

})
export class MutualNavComponent implements OnInit {
  //mainList = ['Categories', 'Designers', 'Stores', 'Price'];
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


  keys = ['Category', 'Product type', 'Designer', 'Store', 'Price'];
  categories = [{ id: 1, name: 'All Categories', checked: true }, { id: 2, name: 'Clothing', checked: false }, { id: 3, name: 'Shoes', checked: false }, { id: 4, name: 'Bags', checked: false }, { id: 5, name: 'Accessories', checked: false }];
  clothings = [
    { id: 1, name: 'Tops', checked: false, servername: 'Tops' },
    { id: 2, name: 'Jackets & Coats', checked: false, servername: 'JacketsOrCoats' },
    { id: 3, name: 'Dresses & Skirts', checked: false, servername: 'DressesOrSkirts' },
    { id: 4, name: 'Pants', checked: false, servername: 'Pants' },
    { id: 5, name: 'Shorts', checked: false, servername: 'Shorts' },
    { id: 6, name: 'Lingerie', checked: false, servername: 'Lingerie' }
  ];
  shoes = [
    { id: 1, name: 'Heels' },
    { id: 2, name: 'Boots' },
    { id: 3, name: 'Sneakers' }]
  productsToShow = [];
  designers = [{ id: 1, name: 'Gucci', checked: false }, { id: 2, name: 'Prada', checked: false }, { id: 3, name: 'D&G', checked: false }, { id: 4, name: 'Isabel Marant', checked: false }, { id: 5, name: 'Loewe', checked: false }, { id: 6, name: 'Saint Laurent', checked: false }, { id: 7, name: 'Celine', checked: false }, { id: 8, name: 'Givenchy', checked: false }, { id: 9, name: 'Fendi', checked: false }];
  stores = [{ id: 1, name: 'ASOS', checked: false }, { id: 8, name: 'ZARA', checked: false }, { id: 3, name: 'Farfetch', checked: false }, { id: 6, name: 'Shopbop', checked: false }, { id: 5, name: 'Shein', checked: false }, { id: 7, name: 'TerminalX', checked: false }, { id: 2, name: 'Net-A-Porter', checked: false }];

  constructor(private formBuilder: FormBuilder, private feedService: FeedService, private errorsService: ErrorsService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.categoryForm = this.formBuilder.group({
      category: ['']
    });
    this.productForm = this.formBuilder.group({
      Clothings: [''],
      Shoes: [''],
      Bags: [''],
      Accesories: ['']
    });
    this.initFilteringDTO();

  }



  initFilteringDTO() {
    this.filteringDTO.category = "";
    this.filteringDTO.productTypes = [];
    this.filteringDTO.designers = [];
    this.filteringDTO.stores = [];
    this.filteringDTO.minPrice = 0;
    this.filteringDTO.maxPrice = this.maxValue;
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
    this.filteringDTO.category = mrChange.value;
    if (mrChange.source.id.toString() != '1') {
      this.showProduct = true;
      switch (mrChange.value) {
        case "Clothing":
          this.productsToShow = this.clothings;
          break;
        case "Shoes":
          this.productsToShow = this.shoes;
          break;
      }
    } else {
      this.filteringDTO.category = null;
      this.showProduct = false;
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
          this.filteringDTO.productTypes.push(elem.servername);
        }
        else {
          const index = this.filteringDTO.productTypes.indexOf(elem.servername, 0);
          if (index > -1) {
            this.filteringDTO.productTypes.splice(index, 1);
          }
        }
        break;
      case "designers":
        if (checked) {
          this.filteringDTO.designers.push(elem.name);
        }
        else {
          const index = this.filteringDTO.designers.indexOf(elem.name, 0);
          if (index > -1) {
            this.filteringDTO.designers.splice(index, 1);
          }
        }
        break;
      case "stores":
        if (checked) {
          this.filteringDTO.designers.push(elem.id);
        }
        else {
          const index = this.filteringDTO.stores.indexOf(elem.id, 0);
          if (index > -1) {
            this.filteringDTO.stores.splice(index, 1);
          }
        }
        break;
    }
  }

  selectedProduct() {
    //this.updateFeedFilteringDTO();
    // var elements = (<HTMLInputElement[]><any>document.getElementsByName("product"));
    // for (let i = 0; i < elements.length; i++) {
    //   if (elements[i].checked) {
    //     console.log(elements[i].value);
    //     this.filteringDTO.productTypes.push(elements[i].value);
    //   }
    // }
  }

  selectedStore() {
  }

  selectedDesigner() {
  }

  selectedPrice() {
    this.filteringDTO.minPrice = this.priceRange.lower;
    this.filteringDTO.maxPrice = this.priceRange.upper;
  }

  clearSelection(arrayToIterrate, filteringDTOarray) {
    arrayToIterrate.forEach(elem => {
      elem.checked = false;
    })
    this.filteringDTO[filteringDTOarray] = [];
    this.menuChanged = true;
    this.menuClosed();
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

}

class PriceRange {
  constructor(
    public lower: number,
    public upper: number
  ) {
  }
}