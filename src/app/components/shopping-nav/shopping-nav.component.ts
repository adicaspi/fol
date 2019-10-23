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
  mainList = ['CATEGORIES', 'DESIGNERS', 'STORES', 'PRICE'];
  originalList = {};
  displayList = {};
  categories = ['CLOTHINGS', 'SHOES', 'BAGS', 'ACCESSORIES'];
  clothings = [
    'ALL CLOTHING',
    'TOPS',
    'JACKETS & COATS',
    'DRESSES & SKIRTS',
    'PANTS',
    'SWIMWEAR'
  ];
  designers = ['ALL DESIGNERS', 'GUCCI', 'PRADA', 'D&G'];
  stores = [
    'ALL STORES',
    'ZARA',
    'FAR FETCH',
    'SHOPBOP',
    'ASOS',
    'TerminalX',
    'ADIKA'
  ];
  price = ['ALL PRICES', '>1000', '1000-5000', '<5000'];
  icon = 'menu';
  currKey: string;
  prevKey: string;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private feedService: FeedService
  ) {
    this.originalList['CATEGORIES'] = this.categories;
    this.originalList['CLOTHINGS'] = this.clothings;
    this.originalList['DESIGNERS'] = this.designers;
    this.originalList['STORES'] = this.stores;
    this.originalList['PRICE'] = this.price;
    this.displayList['CATEGORIES'] = this.categories;
    this.displayList['DESIGNERS'] = this.designers;
    this.displayList['STORES'] = this.stores;
    this.displayList['PRICE'] = this.price;
  }

  getKeys() {
    return Object.keys(this.displayList);
  }

  getValues(key) {
    this.prevKey = this.currKey;
    this.currKey = key;

    if (key === 'back') {
      if (this.prevKey == 'CLOTHINGS') {
        this.mainList = Object.values(this.originalList['CATEGORIES']);
      }
      else {
        this.mainList = this.getKeys();
        this.showBack = false;
      }

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
