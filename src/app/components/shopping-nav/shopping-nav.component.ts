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
  mainList = ['Categories', 'Designers', 'Stores', 'Price'];
  originalList = {};
  Categories = ['Clothings', 'Shoes', 'Bags'];
  Designers = ['All Designers', 'Gucci', 'Prada', 'D&G'];
  Stores = ['All Stores', 'ASOS', 'ZARA', 'Adika'];
  Price = ['All Prices', '<1000', '1000-5000', '<5000'];
  icon = 'menu';

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private feedService: FeedService
  ) {
    this.originalList['Categories'] = this.Categories;
    this.originalList['Designers'] = this.Designers;
    this.originalList['Stores'] = this.Stores;
    this.originalList['Price'] = this.Price;
    console.log(this.originalList['Categoris']);
  }

  changeMenu(item) {
    this.mainList = ['heels', 'boots'];
  }

  getKeys() {
    return Object.keys(this.originalList);
  }

  getValues(key) {
    console.log('im key', key);
    if (key === 'back') {
      this.mainList = this.getKeys();
    }
    this.mainList = Object.values(this.originalList[key]);
  }

  onOpen() {
    this.icon = 'arrow_back_ios';
  }

  onClose() {
    this.icon = 'menu';
  }
}
