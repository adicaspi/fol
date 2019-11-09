import { Component, OnInit, Output, EventEmitter, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as $ from 'jquery';
import { MatRadioChange, MatRadioButton, MatMenuTrigger, MatCheckboxChange } from '../../../../node_modules/@angular/material';
import { Options, LabelType } from 'ng5-slider';
import { Ng5SliderModule } from 'ng5-slider';
import { SliderType } from "igniteui-angular";
import { FilteringDTO } from '../../models/FilteringDTO';
import { FeedService } from '../../services/feed.service';


@Component({
  selector: 'app-mutual-nav',
  templateUrl: './mutual-nav.component.html',
  styleUrls: ['./mutual-nav.component.css'],

})
export class MutualNavComponent implements OnInit {
  //mainList = ['Categories', 'Designers', 'Stores', 'Price'];
  @Output()
  change: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild(MatMenuTrigger, { static: false }) menu: MatMenuTrigger;
  public sliderType = SliderType;
  public priceRange: PriceRange = new PriceRange(200, 800);
  options: Options = {
    floor: 0,
    ceil: 5000,
    step: 100,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '$' + value;
        case LabelType.High:
          return '$' + value;
        default:
          return '$' + value;
      }
    }
  }
  minValue: number = 0;
  maxValue: number = 5000;
  categoryForm: FormGroup;
  productForm: FormGroup;
  categroyRadioButton: MatRadioButton = null;
  allCategroiesRadioButton: MatRadioButton = null;
  showProduct: boolean = false;
  class = 'filtered';
  menu_class = 'popup';
  aria_expanded = 'false';
  mainList = {};
  filteringDTO = new FilteringDTO();
  keys = ['Category', 'Product type', 'Designer', 'Store', 'Price'];
  categories = [{ id: 1, name: 'All Categories', checked: true }, { id: 2, name: 'Clothing', checked: false }, { id: 3, name: 'Shoes', checked: false }, { id: 4, name: 'Bags', checked: false }, { id: 5, name: 'Accessories', checked: false }];
  clothings = [
    { id: 1, name: 'Tops', checked: false },
    { id: 2, name: 'Jackets & Coats', checked: false },
    { id: 3, name: 'Dresses & Skirts', checked: false },
    { id: 4, name: 'Pants', checked: false },
    { id: 5, name: 'Shorts', checked: false },
    { id: 6, name: 'Lingerie', checked: false }
  ];
  shoes = [
    { id: 1, name: 'Heels' },
    { id: 2, name: 'Boots' },
    { id: 3, name: 'Sneakers' }]
  productsToShow = [];
  designers = [{ id: 1, name: 'Gucci', checked: false }, { id: 2, name: 'Prada', checked: false }, { id: 3, name: 'D&G', checked: false }, { id: 4, name: 'Isabel Marant', checked: false }, { id: 5, name: 'Loewe', checked: false }, { id: 6, name: 'Saint Laurent', checked: false }, { id: 7, name: 'Celine', checked: false }, { id: 8, name: 'Givenchy', checked: false }, { id: 9, name: 'Fendi', checked: false }];
  stores = [{ id: 1, name: 'ASOS', checked: false }, { id: 2, name: 'ZARA', checked: false }, { id: 3, name: 'Farfetch', checked: false }, { id: 4, name: 'Shopbop', checked: false }, { id: 5, name: 'Shein', checked: false }, { id: 6, name: 'TerminalX', checked: false }, { id: 7, name: 'Net-A-Porter', checked: false }];

  constructor(private formBuilder: FormBuilder, private feedService: FeedService) { }

  ngOnInit() {
    this.mainList['Category'] = this.categories;
    this.mainList['Product type'] = this.clothings;
    this.mainList['Designer'] = this.designers;
    this.mainList['Store'] = this.stores;
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
    if (mrChange.value != "All") {
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
      this.showProduct = false;
    }
    //this.categroyRadioButton = mrChange.source;
    //console.log(this.categroyRadioButton.name);
  }

  onChangeCheckBox(key, $event, elem) {
    if ($event.checked == true) {
      elem.checked = true;
      this.filtering(key, elem, true)
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
          if (elem.name == 'Jackets & Coats') {
            this.filteringDTO.productTypes.push('JacketsOrCoats');
          }
          if (elem.name == 'Dresses & Skirts')
            this.filteringDTO.productTypes.push('DressesOrSkirts');
          else {
            this.filteringDTO.productTypes.push(elem.name);
          }
        }
        else {
        }
        const index = this.filteringDTO.productTypes.indexOf(elem, 0);
        if (index > -1) {
          this.filteringDTO.productTypes.splice(index, 1);
        }
        this.updateFeedFilteringDTO();
        break;
      case "designers":
        if (checked) {
          this.filteringDTO.designers.push(elem.name);
        }
        else {
          const index = this.filteringDTO.designers.indexOf(elem, 0);
          if (index > -1) {
            this.filteringDTO.productTypes.splice(index, 1);
          }
          this.updateFeedFilteringDTO();
        }
        break;
      case "stores":
        if (checked) {
          this.filteringDTO.designers.push(elem.name);
        }
        else {
          const index = this.filteringDTO.stores.indexOf(elem, 0);
          if (index > -1) {
            this.filteringDTO.productTypes.splice(index, 1);
          }
          this.updateFeedFilteringDTO();
        }
        break;
    }
  }

  selectedProduct() {
    var elements = (<HTMLInputElement[]><any>document.getElementsByName("product"));
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].checked) {
        console.log(elements[i].value);
        this.filteringDTO.productTypes.push(elements[i].value);
      }
    }
  }

  selectedStore() {
    var elements = (<HTMLInputElement[]><any>document.getElementsByName("store"));
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].checked) {
        console.log(elements[i].value);
      }
    }
  }

  selectedDesigner() {
    var elements = (<HTMLInputElement[]><any>document.getElementsByName("designer"));
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].checked) {
        console.log(elements[i].value);
      }
    }
  }

  selectedPrice() {
    this.filteringDTO.minPrice = this.minValue;
    this.filteringDTO.maxPrice = this.maxValue;
    this.updateFeedFilteringDTO();
  }

  clearSelection(arrayToIterrate) {
    console.log("in clear", arrayToIterrate);
    arrayToIterrate.forEach(elem => {
      elem.checked = false;
    })
  }

  OnChangePriceSlider($event) {
    console.log("in price");
    console.log($event.value);
  }
  getKeys() {
    return this.keys;
  }

  getValues(key) {
    return Object.values(this.mainList[key]);
  }

  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }

    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  getProductTypeElement() {
    let productType = $('.dropbtn.product');
    productType.css({
      display: 'initial'
    });

  }

  updateFeedFilteringDTO() {
    this.feedService.filteringDTO = this.filteringDTO;
  }

}

class PriceRange {
  constructor(
    public lower: number,
    public upper: number
  ) {
  }
}