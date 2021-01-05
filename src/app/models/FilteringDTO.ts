export class FilteringDTO {
  category: string = null;
  allCategoriesSelected: number = 1;
  productTypes: string[] = [];
  designers: string[] = [];
  stores: number[] = [];
  minPrice: number = 0;
  maxPrice: number = 0;
  filteringDTOPayLoad = {};

  clothing = [
    { id: 1, name: 'Tops', checked: false, servername: 'Tops' },
    { id: 2, name: 'Jackets & Coats', checked: false, servername: 'JacketsOrCoats' },
    { id: 3, name: 'Dresses & Skirts', checked: false, servername: 'DressesOrSkirts' },
    { id: 4, name: 'Pants', checked: false, servername: 'Pants' },
    { id: 5, name: 'Shorts', checked: false, servername: 'Shorts' },
    { id: 6, name: 'Lingerie', checked: false, servername: 'Lingerie' }
  ];
  designersObjects = [{ id: 1, name: 'Gucci', checked: false }, { id: 2, name: 'Prada', checked: false }, { id: 3, name: 'D&G', checked: false }, { id: 4, name: 'Isabel Marant', checked: false }, { id: 5, name: 'Loewe', checked: false }, { id: 6, name: 'Saint Laurent', checked: false }, { id: 7, name: 'Celine', checked: false }, { id: 8, name: 'Givenchy', checked: false }, { id: 9, name: 'Fendi', checked: false }, { id: 10, name: 'Miu Miu', checked: false }, { id: 11, name: 'Valentino', checked: false }];
  storesObjects = [{ id: 1, name: 'Asos', checked: false }, { id: 8, name: 'Zara', checked: false }, { id: 3, name: 'Farfetch', checked: false }, { id: 6, name: 'Shopbop', checked: false }, { id: 5, name: 'Shein', checked: false }, { id: 7, name: 'TerminalX', checked: false }, { id: 2, name: 'Net-A-Porter', checked: false }, { id: 9, name: 'Revolve', checked: false }, { id: 11, name: 'Topshop', checked: false }, { id: 12, name: 'Mytheresa', checked: false }, { id: 13, name: 'The Outnet', checked: false }, { id: 10, name: 'Factory54', checked: false }];
  //prices = [{ value: 100, checked: false }, { value: 200, checked: false }, { value: 300, checked: false }, { value: 400, checked: false }, { value: 500, checked: false }];

  setCategory(category) {
    this.category = category;
  }

  get categoryIsFiltered() {
    return (!this.allCategoriesSelected);
  }

  get productTypeIsFiltered() {
    return this.productTypes.length;
  }

  get storesIsFiltered() {
    return this.stores.length;
  }

  get designersIsFiltered() {
    return this.designers.length;
  }

  get priceIsFiltered() {
    return (this.minPrice > 0 || this.maxPrice > 0)
  }

  get menuIsFiltered() {
    return (this.productTypeIsFiltered || this.storesIsFiltered || this.designersIsFiltered || this.priceIsFiltered)
  }

  getCategory() {
    return this.category;
  }

  setProductTypes(item) {
    this.productTypes.push(item.servername);
  }

  setDesigners(designer) {
    this.designers.push(designer.name);
  }

  setStores(store) {
    this.stores.push(store.id);
  }

  getStores() {
    return this.stores;
  }

  getDesigners() {
    return this.designers;
  }

  get getDesignersObjects() {
    return this.designersObjects;
  }

  get getStoresObjects() {
    return this.storesObjects;
  }

  get clothingProductType() {
    return this.clothing;
  }

  getProductTypes() {
    return this.productTypes;
  }

  setMinPrice(minPrice) {
    this.minPrice = minPrice;
  }

  setMaxPrice(maxPrice) {
    this.maxPrice = maxPrice;
  }

  getMinPrice() {
    return this.minPrice;
  }

  getMaxPrice() {
    return this.maxPrice;
  }

  removeDesigner(designer) {
    const index = this.designers.indexOf(designer.name, 0);
    if (index > -1) {
      this.getDesigners().splice(index, 1);
    }
  }

  removeStore(store) {
    let index = this.stores.indexOf(store.id, 0);
    if (index > -1) {
      this.stores.splice(index, 1);
    }
  }

  removeProduct(elem) {
    let index = this.productTypes.indexOf(elem.servername, 0);
    if (index > -1) {
      this.productTypes.splice(index, 1);
    }
  }

  removeProductType() {
    this.productTypes = [];
  }

  clearProductType() {
    this.productTypes = [];
    this.clothing.forEach(elem => {
      elem.checked = false;
    })
  }

  clearDesigners() {
    this.designers = [];
    this.designersObjects.forEach(elem => {
      elem.checked = false;
    })
  }

  clearStores() {
    this.stores = [];
    this.storesObjects.forEach(elem => {
      elem.checked = false;
    })
  }

  getFilteringDTO() {
    return ({
      category: this.category,
      productTypes: this.productTypes,
      designers: this.designers,
      stores: this.stores,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    });
  }


}