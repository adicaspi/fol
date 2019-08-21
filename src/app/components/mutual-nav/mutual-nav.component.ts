import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-mutual-nav',
  templateUrl: './mutual-nav.component.html',
  styleUrls: ['./mutual-nav.component.css']
})
export class MutualNavComponent implements OnInit {
  //mainList = ['Categories', 'Designers', 'Stores', 'Price'];
  @Output()
  change: EventEmitter<string> = new EventEmitter<string>();
  class = 'filtered';
  menu_class = 'popup';
  aria_expanded = 'false';
  mainList = {};
  keys = ['Category', 'Product type', 'Designer', 'Store', 'Price'];
  openDropDownKey: any;
  prevOpenKey: any;
  Categories = ['Clothings', 'Shoes', 'Bags', 'Accesories'];
  ProductType = [
    'All clothings',
    'Tops',
    'Jackets & Coats',
    'Dresses & Skirts',
    'Pants',
    'Swimwear'
  ];
  Designers = ['All Designers', 'Gucci', 'Prada', 'D&G'];
  Stores = ['All Stores', 'ASOS', 'ZARA', 'Adika'];
  Price = ['All Prices', '<1000', '1000-5000', '<5000'];

  constructor() {}

  ngOnInit() {
    this.mainList['Category'] = this.Categories;
    this.mainList['Product type'] = this.ProductType;
    this.mainList['Designer'] = this.Designers;
    this.mainList['Store'] = this.Stores;
    this.mainList['Price'] = this.Price;
  }

  changeMenu(key, i) {
    this.change.emit(this.class);
    let dropDownID = $('#_' + i);

    if (this.openDropDownKey) {
      this.prevOpenKey.css({
        display: 'none'
      });
      if (this.openDropDownKey == key) {
        this.openDropDownKey = null;
        return;
      }
    }
    this.prevOpenKey = dropDownID;
    this.openDropDownKey = key;
    dropDownID.css({
      display: 'block'
    });
  }

  getKeys() {
    return this.keys;
  }

  getValues(key) {
    return Object.values(this.mainList[key]);
  }
}
