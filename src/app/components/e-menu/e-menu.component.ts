import { Component, OnInit, HostListener, Host } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-e-menu',
  templateUrl: './e-menu.component.html',
  styleUrls: ['./e-menu.component.css']
})
export class EMenuComponent implements OnInit {
  loggedin = false;
  index = 0;
  display: boolean;
  categoriesTitle = {
    title: 'Categoris'
  };
  productTitle = {
    title: 'Product Type'
  };
  designerTitle = {
    title: 'Designers'
  };
  storesTitle = {
    title: 'Stores'
  };
  priceTitle = {
    title: 'Price'
  };

  categoriesTab = ['All Categories', 'Clothing', 'Shoes', 'Bags'];
  productType = {
    0: ['All Products', 'Trending Now', "What's New", 'SALE'],
    1: ['All Clothing', 'Dresses', 'Activwear', 'Trending Now'],
    2: ['All Shoes', 'High Heels', 'Boots', 'Trending Now'],
    3: ['All Bags', 'Backpacks', 'Belt Bags', 'Trending Now']
  };

  designerTab = ['All Designers', 'Dolce & Gabana', 'Chloe', 'Gucci'];
  storesTab = ['All Stores', 'ZARA', 'ASOS', 'Net-A-Porter'];
  priceTab = ['All Prices', '<$100', '$100-$500', '>$500'];
  filteredMenu = {
    categoris: 0,
    productType: [],
    desginers: 0,
    stores: 0,
    price: 0
  };
  constructor(private userService: UserService) {}

  ngOnInit() {
    window.dispatchEvent(new Event('resize'));
    if (this.userService.userId) {
      this.loggedin = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  sizeChange(event) {
    if (event.target.innerWidth <= 575) {
      this.display = true;
    } else {
      this.display = false;
    }
  }

  filterCtegories(itemIndex) {
    this.filteredMenu['categoris'] = itemIndex;
    this.filteredMenu['productType'][itemIndex] = 0;
    this.categoriesTitle.title = this.categoriesTab[itemIndex];
    this.productTitle.title = this.productType[itemIndex][0];
  }

  filterProductType(itemIndex) {
    // product type is being filtered but categoris is defualt
    if (this.filteredMenu['categoris'] == 0) {
      this.filteredMenu['productType'][0] = itemIndex;
      this.productTitle.title = this.productType[0][itemIndex];
      this.index = itemIndex;
    }
    //categoris are already filtered - need to extract product type index
    else {
      let categoriesIndex = this.filteredMenu['categoris'];
      this.filteredMenu['productType'][categoriesIndex] = itemIndex;
      this.productTitle.title = this.productType[categoriesIndex][itemIndex];
      this.index = categoriesIndex;
    }
  }

  filterDesigners(itemIndex) {
    this.filteredMenu['desginers'] = itemIndex;
    this.designerTitle.title = this.designerTab[itemIndex];
  }

  filterStores(itemIndex) {
    this.filteredMenu['stores'] = itemIndex;
    this.storesTitle.title = this.storesTab[itemIndex];
  }

  filterPrice(itemIndex) {
    this.filteredMenu['price'] = itemIndex;
    this.priceTitle.title = this.priceTab[itemIndex];
  }
}
