import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShoppingNavService {
  desktopMenu = [{ id: 1, name: 'All Categories', checked: true }, { id: 2, name: 'Clothing', checked: false }, { id: 3, name: 'Shoes', checked: false }, { id: 4, name: 'Bags', checked: false }, { id: 5, name: 'Accessories', checked: false }];
  mobileMenu = [{ id: 1, name: 'All', checked: true }, { id: 2, name: 'Clothing', checked: false }, { id: 3, name: 'Shoes', checked: false }, { id: 4, name: 'Bags', checked: false }, { id: 5, name: 'Accessories', checked: false }];

  clothing = [
    { id: 1, name: 'Tops', checked: false, servername: 'Tops' },
    { id: 2, name: 'Jackets & Coats', checked: false, servername: 'JacketsOrCoats' },
    { id: 3, name: 'Dresses & Skirts', checked: false, servername: 'DressesOrSkirts' },
    { id: 4, name: 'Pants', checked: false, servername: 'Pants' },
    { id: 5, name: 'Shorts', checked: false, servername: 'Shorts' },
    { id: 6, name: 'Lingerie', checked: false, servername: 'Lingerie' }
  ];
  designers = [{ id: 1, name: 'Gucci', checked: false }, { id: 2, name: 'Prada', checked: false }, { id: 3, name: 'D&G', checked: false }, { id: 4, name: 'Isabel Marant', checked: false }, { id: 5, name: 'Loewe', checked: false }, { id: 6, name: 'Saint Laurent', checked: false }, { id: 7, name: 'Celine', checked: false }, { id: 8, name: 'Givenchy', checked: false }, { id: 9, name: 'Fendi', checked: false }];
  stores = [{ id: 1, name: 'Asos', checked: false }, { id: 8, name: 'Zara', checked: false }, { id: 3, name: 'Farfetch', checked: false }, { id: 6, name: 'Shopbop', checked: false }, { id: 5, name: 'Shein', checked: false }, { id: 7, name: 'TerminalX', checked: false }, { id: 2, name: 'Net-A-Porter', checked: false }, { id: 9, name: 'Revolve', checked: false }, { id: 11, name: 'Topshop', checked: false }, { id: 12, name: 'Mytheresa', checked: false }];
  prices = [{ value: 100, checked: false }, { value: 200, checked: false }, { value: 300, checked: false }, { value: 400, checked: false }, { value: 500, checked: false }];
  constructor() { }
}
