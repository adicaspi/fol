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
    { id: 1, name: 'Tops', checked: false },
    { id: 2, name: 'Jackets & Coats', checked: false },
    { id: 3, name: 'Dresses & Skirts', checked: false },
    { id: 4, name: 'Pants', checked: false },
    { id: 5, name: 'Swimwear', checked: false }
  ];
  shoes = [
    { id: 1, name: 'Heels' },
    { id: 2, name: 'Boots' },
    { id: 3, name: 'Sneakers' }]
  productsToShow = [];
  designers = [{ id: 1, name: 'Gucci', checked: false }, { id: 2, name: 'Prada', checked: false }, { id: 3, name: 'D&G', checked: false }, { id: 4, name: 'Isabel Marant', checked: false }, { id: 5, name: 'Loewe', checked: false }, { id: 6, name: 'Saint Laurent', checked: false }, { id: 7, name: 'Celine', checked: false }, { id: 8, name: 'Givenchy', checked: false }, { id: 9, name: 'Fendi', checked: false }];
  stores = [{ id: 1, name: 'ASOS', checked: false }, { id: 2, name: 'ZARA', checked: false }, { id: 3, name: 'Farfetch', checked: false }, { id: 4, name: 'Shopbop', checked: false }, { id: 5, name: 'Shein', checked: false }, { id: 6, name: 'TerminalX', checked: false }, { id: 7, name: 'Net-A-Porter', checked: false }];

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

  onChangeCheckBox($event, elem) {
    if ($event.checked == true) {
      elem.checked = true;
    }
    else {
      elem.checked = false;
    }
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

  clearSelection(arrayToIterrate) {
    console.log("in clear", arrayToIterrate);
    arrayToIterrate.forEach(elem => {
      elem.checked = false;
    })
  }

  onChangeAllCheckBox($event, elem, arrayToIterrate) {

    if (elem.id == 1) {
      if ($event.checked == true) {
        elem.checked = true;
        arrayToIterrate.forEach(function (elem) {
          elem.checked = true;
        })
      } else {
        elem.checked = false
        arrayToIterrate.forEach(function (elem) {
          elem.checked = false;
        })
      }
    } else {
      if ($event.checked == false) {
        elem.checked = false;
        arrayToIterrate[0].checked = false;
      }
      else {
        var allChecked = true;
        elem.checked = true;
        arrayToIterrate.forEach(function (elem) {
          if (elem.id != 1) {
            if (elem.checked == false) {
              arrayToIterrate[0].checked = false;
              allChecked = false;
            }
          }
        })
        if (allChecked) {
          arrayToIterrate[0].checked = true;
        }
      }
    }
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
