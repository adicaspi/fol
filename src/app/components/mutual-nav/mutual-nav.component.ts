import { Component, OnInit, Output, EventEmitter } from '@angular/core';

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
  mainList = {};
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

  constructor() {
    this.mainList['Category'] = this.Categories;
    this.mainList['Product type'] = this.ProductType;
    this.mainList['Designer'] = this.Designers;
    this.mainList['Store'] = this.Stores;
    this.mainList['Price'] = this.Price;
  }

  ngOnInit() {}

  changeMenu() {
    this.change.emit(this.class);
  }

  getKeys() {
    return Object.keys(this.mainList);
  }

  getValues(key) {
    return Object.values(this.mainList[key]);
  }
}
