import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mutual-nav',
  templateUrl: './mutual-nav.component.html',
  styleUrls: ['./mutual-nav.component.css']
})
export class MutualNavComponent implements OnInit {
  //mainList = ['Categories', 'Designers', 'Stores', 'Price'];
  mainList = {};
  Categories = ['Clothings', 'Shoes', 'Bags'];
  Designers = ['All Designers', 'Gucci', 'Prada', 'D&G'];
  Stores = ['All Stores', 'ASOS', 'ZARA', 'Adika'];
  Price = ['All Prices', '<1000', '1000-5000', '<5000'];
  constructor() {
    this.mainList['Categoris'] = this.Categories;
    this.mainList['Designers'] = this.Designers;
    this.mainList['Stores'] = this.Stores;
    this.mainList['Price'] = this.Price;
  }

  ngOnInit() {}

  changeMenu(item) {
    // this.mainList = ['heels', 'boots'];
  }

  getKeys() {
    return Object.keys(this.mainList);
  }

  getValues(key) {
    return Object.values(this.mainList[key]);
  }
}
