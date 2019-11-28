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

  getCategory() {
    return this.category;
  }

  setProductTypes(item) {
    this.productTypes.push(item.servername);
  }

  setDesigners(designer) {
    this.designers.push(designer);
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

  removeProductType() {
    this.productTypes = [];
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