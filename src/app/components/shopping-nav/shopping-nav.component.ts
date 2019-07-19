import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { FeedService } from '../../services/feed.service';

@Component({
  selector: 'app-shopping-nav',
  templateUrl: './shopping-nav.component.html',
  styleUrls: ['./shopping-nav.component.css']
})
export class ShoppingNavComponent {
  showBack: boolean = false;
  mainList = ['CATEGORIES', 'PRODUCT TYPE', 'DESIGNERS', 'STORES', 'PRICE'];
  originalList = {};
  Categories = ['CLOTHING', 'SHOES', 'BAGS', 'ACCESSORIES'];
  ProductType = [
    'ALL CLOTHING',
    'TOPS',
    'JACKETS & COATS',
    'DRESSES & SKIRTS',
    'PANTS',
    'SWIMWEAR'
  ];
  Designers = ['ALL DESIGNERS', 'GUCCI', 'PRADA', 'D&G'];
  Stores = [
    'ALL STORES',
    'ZARA',
    'FAR FETCH',
    'SHOPBOP',
    'ASOS',
    'TerminalX',
    'ADIKA'
  ];
  Price = ['ALL PRICES', '>1000', '1000-5000', '<5000'];
  icon = 'menu';

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private feedService: FeedService
  ) {
    this.originalList['CATEGORIES'] = this.Categories;
    this.originalList['PRODUCT TYPE'] = this.ProductType;
    this.originalList['DESIGNERS'] = this.Designers;
    this.originalList['STORES'] = this.Stores;
    this.originalList['PRICE'] = this.Price;
  }

  changeMenu(item) {
    this.mainList = ['heels', 'boots'];
  }

  getKeys() {
    return Object.keys(this.originalList);
  }

  getValues(key) {
    if (key === 'back') {
      this.mainList = this.getKeys();
      this.showBack = false;
    } else {
      this.mainList = Object.values(this.originalList[key]);
      this.showBack = true;
    }
  }

  onOpen() {
    this.icon = 'arrow_back_ios';
  }

  onClose() {
    this.icon = 'menu';
  }
}
