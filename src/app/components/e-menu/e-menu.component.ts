import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-e-menu',
  templateUrl: './e-menu.component.html',
  styleUrls: ['./e-menu.component.css']
})
export class EMenuComponent implements OnInit {
  index: String = 'default';
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

  categoriesTab: String[] = ['All Categories', 'Clothing', 'Shoes', 'Bags'];
  productType = {
    default: ['All Products', 'Trending Now', "What's New", 'SALE'],
    clothing: ['All Clothing', 'Dresses', 'Activwear', 'Trending Now'],
    shoes: ['All Shoes', 'High Heels', 'Boots', 'Trending Now'],
    bags: ['All Bags', 'Backpacks', 'Belt Bags', 'Trending Now']
  };
  designerTab: String[] = ['All Designers', 'Dolce & Gabana', 'Chloe', 'Gucci'];
  storesTab: String[] = ['All Stores', 'ZARA', 'ASOS', 'Net-A-Porter'];
  priceTab: String[] = ['All Prices', '<$100', '$100-$500', '>$500'];
  filteredMenu = {
    categoris: '',
    productType: '',
    desginers: '',
    stores: '',
    price: ''
  };
  constructor() {}

  ngOnInit() {}
}
