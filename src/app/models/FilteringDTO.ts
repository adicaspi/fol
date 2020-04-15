export class FilteringDTO {
  category: string = null;
  productTypes: string[] = [];
  designers: string[] = [];
  stores: number[] = [];
  minPrice: number = 0;
  maxPrice: number = 0;

  setCategory(category) {
    this.category = category;
  }

  get categoryIsFiltered() {
    return this.category != null;
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
    return (this.minPrice > 0 || this.maxPrice > 0 && this.maxPrice < 1800)
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
  }

  clearDesigners() {
    this.designers = [];
  }

  clearStores() {
    this.stores = [];
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