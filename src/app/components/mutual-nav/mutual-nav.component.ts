import { Component, OnInit, Output, EventEmitter, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as $ from 'jquery';
import { MatRadioChange, MatRadioButton, MatMenuTrigger, MatCheckboxChange } from '../../../../node_modules/@angular/material';

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
  prevOpenID: any;
  currentOpenKey: any = null;
  prevOpenKey: any = null;
  categories = [{ id: 1, name: 'All Categories', checked: true }, { id: 2, name: 'Clothings', checked: false }, { id: 3, name: 'Shoes', checked: false }, { id: 4, name: 'Bags', checked: false }, { id: 5, name: 'Accesories', checked: false }];
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
    console.log("im val", val);
  }

  clearCategoryForm() {
    console.log("im in clear");
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

  OnChangeDesignerCheckBox($event) {
    console.log("in designer");
    console.log($event.source);
    //$event.source.toggle();
    //MatCheckboxChange {checked,MatCheckbox}
  }

  OnChangeStoreCheckBox($event) {
    console.log("in store");
    console.log($event.source);
  }

  OnChangePriceSlider($event) {
    console.log("in price");
    console.log($event.value);

  }



  changeMenu(key, i) {
    //this.change.emit(this.class);
    if (key == 'category') {
      this.getProductTypeElement();
    }
    this.currentOpenKey = key;
    let currentDropDownID = $('#_' + key);
    let btn = $('.submit-btn');
    let currentDropBtn = $('.dropbtn.' + key);

    //checking if this isn't the first time user opens dropbtn, if it's not then display prev key as none;
    if (this.prevOpenKey) {
      let prevDropBtn = $('.dropbtn.' + this.prevOpenKey);
      // prevDropBtn.css({
      //   color: 'rgb(140, 140, 140)'
      // });
      this.prevOpenID.css({
        display: 'none'
      });

      //if user opened and closes same dropdown then just clear all fields and return

      if (this.prevOpenKey == key) {
        this.currentOpenKey = null;
        this.prevOpenKey = null;
        btn.css({
          display: 'none'
        });
        return;

        //else user openes a new dropdown which is not the same dropdown currently opens
      } else {
        this.prevOpenKey = this.currentOpenKey;
        this.prevOpenID = currentDropDownID;
      }
    }
    // if this is the very first time the user filters the menu
    else {
      this.prevOpenKey = key;
      this.prevOpenID = currentDropDownID;
    }
    //anyway do this when user clicks the menu
    currentDropDownID.css({
      display: 'block'
    });
    btn.css({
      display: 'initial'
    });
    currentDropBtn.css({
      color: 'black'
    });
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
