import { Component, OnInit, Output, EventEmitter, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as $ from 'jquery';
import { MatRadioChange, MatRadioButton, MatMenuTrigger, MatCheckboxChange } from '../../../../node_modules/@angular/material';
import { Options, LabelType } from 'ng5-slider';
import { Ng5SliderModule } from 'ng5-slider';


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
  keys = ['Category', 'Product type', 'Designer', 'Store', 'Price'];
  categories = [{ id: 1, name: 'All Categories', checked: true }, { id: 2, name: 'Clothings', checked: false }, { id: 3, name: 'Shoes', checked: false }, { id: 4, name: 'Bags', checked: false }, { id: 5, name: 'Accessories', checked: false }];
  clothings = [
    { id: 1, name: 'All Clothings' },
    { id: 2, name: 'Tops' },
    { id: 3, name: 'Jackets & Coats' },
    { id: 4, name: 'Dresses & Skirts' },
    { id: 5, name: 'Pants' },
    { id: 6, name: 'Swimwear' }
  ];
  shoes = [{ id: 1, name: 'All Shoes' },
  { id: 2, name: 'Heels' },
  { id: 3, name: 'Boots' },
  { id: 4, name: 'Sneakers' }]
  productsToShow = [];
  designers = [{ id: 1, name: 'All Designers' }, { id: 2, name: 'Gucci' }, { id: 3, name: 'Prada' }, { id: 4, name: 'D&G' }];
  stores = [{ id: 1, name: 'All Stores' }, { id: 2, name: 'ASOS' }, { id: 3, name: 'ZARA' }, { id: 4, name: 'Adika' }];

  constructor(private formBuilder: FormBuilder) { }

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
    console.log(mrChange.value);
    if (mrChange.value != 1) {
      this.showProduct = true;
      switch (mrChange.value) {
        case 2:
          this.productsToShow = this.clothings;
          break;
        case 3:
          this.productsToShow = this.shoes;
          break;

      }
    } else {
      this.showProduct = false;

    }
    //this.categroyRadioButton = mrChange.source;

    //console.log(this.categroyRadioButton.name);

  }

  selectedProduct() {
    var elements = (<HTMLInputElement[]><any>document.getElementsByName("product"));
    for (let i = 0; i < elements.length; i++) {

      if (elements[i].checked) {
        console.log(elements[i].value);
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
    (this.maxValue, this.minValue);
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
}
