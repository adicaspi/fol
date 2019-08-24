import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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
  categoryForm: FormGroup;
  productForm: FormGroup;
  class = 'filtered';
  menu_class = 'popup';
  aria_expanded = 'false';
  mainList = {};
  keys = ['Category', 'Product type', 'Designer', 'Store', 'Price'];
  prevOpenID: any;
  currentOpenKey: any = null;
  prevOpenKey: any = null;
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
  Price = ['All Prices', 'High to Low', 'Low to High'];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.mainList['Category'] = this.Categories;
    this.mainList['Product type'] = this.ProductType;
    this.mainList['Designer'] = this.Designers;
    this.mainList['Store'] = this.Stores;
    this.mainList['Price'] = this.Price;
    this.categoryForm = this.formBuilder.group({
      Clothings: [''],
      Shoes: [''],
      Bags: [''],
      Accesories: ['']
    });
    this.productForm = this.formBuilder.group({
      Clothings: [''],
      Shoes: [''],
      Bags: [''],
      Accesories: ['']
    });
  }

  changeMenu(key, i) {
    //this.change.emit(this.class);
    this.currentOpenKey = key;
    let currentDropDownID = $('#_' + key);
    let btn = $('.submit-btn');
    let currentDropBtn = $('.dropbtn.' + key);

    //checking if this isn't the first time user opens dropbtn, if it's not then display prev key as none;
    if (this.prevOpenKey) {
      let prevDropBtn = $('.dropbtn.' + this.prevOpenKey);
      prevDropBtn.css({
        color: 'rgb(140, 140, 140)'
      });
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
}
