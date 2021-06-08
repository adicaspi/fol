export class FilteringDTO {
  category: string = null;
  allCategoriesSelected: number = 1;
  productTypes: string[] = [];
  designers: string[] = [];
  stores: number[] = [];
  minPrice: number = 0;
  maxPrice: number = 0;
  priceIsFiltered: boolean = false;
  filteringDTOPayLoad = {};

  categoriesObjects = [{ id: 1, name: 'All Categories', displayName: 'All', checked: true }, { id: 2, name: 'Clothing', displayName: 'Clothing', checked: false }, { id: 3, name: 'Shoes', displayName: 'Shoes', checked: false }, { id: 4, name: 'Bags', displayName: 'Bags', checked: false }, { id: 5, name: 'Accessories', displayName: 'Accessories', checked: false }];

  clothing = [
    { id: 1, name: 'Tops', checked: false, servername: 'Tops' },
    { id: 2, name: 'Jackets & Coats', checked: false, servername: 'JacketsOrCoats' },
    { id: 3, name: 'Dresses & Skirts', checked: false, servername: 'DressesOrSkirts' },
    { id: 4, name: 'Pants', checked: false, servername: 'Pants' },
    { id: 5, name: 'Shorts', checked: false, servername: 'Shorts' },
    { id: 6, name: 'Lingerie', checked: false, servername: 'Lingerie' }
  ];
  designersObjects = [{ id: 1, name: 'Gucci', checked: false }, { id: 2, name: 'Prada', checked: false }, { id: 4, name: 'Isabel Marant', checked: false }, { id: 8, name: 'Givenchy', checked: false }, { id: 10, name: 'Miu Miu', checked: false }, { id: 5, name: 'Loewe', checked: false }, { id: 6, name: 'Saint Laurent', checked: false }, { id: 7, name: 'Celine', checked: false }, { id: 9, name: 'Fendi', checked: false }, { id: 11, name: 'Valentino', checked: false }, { id: 3, name: 'D&G', checked: false },];
  storesObjects = [{ id: 8, name: 'Zara', checked: false, show: true }, { id: 1, name: 'Asos', checked: false, show: true }, { id: 5, name: 'Shein', checked: false, show: true }, { id: 2, name: 'Net-A-Porter', checked: false, show: true }, { id: 3, name: 'Farfetch', checked: false, show: true }, { id: 6, name: 'Shopbop', checked: false, show: true }, { id: 7, name: 'TerminalX', checked: false, show: true }, { id: 9, name: 'Revolve', checked: false, show: true }, { id: 10, name: 'Factory54', checked: false, show: true }, { id: 13, name: 'The Outnet', checked: false, show: true }, { id: 14, name: 'Massimo Dutti', checked: false, show: true }, { id: 12, name: 'Mytheresa', checked: false, show: true }, { id: 20, name: 'Coconutlove', checked: false, show: true }
    , { id: 17, name: 'Renuar', checked: false, show: true }, { id: 18, name: 'TFS', checked: false, show: true }
  ];
  //prices = [{ value: 100, checked: false }, { value: 200, checked: false }, { value: 300, checked: false }, { value: 400, checked: false }, { value: 500, checked: false }];


  setCategory(category) {
    this.category = category;
    this.changeStatusCategorisObjects();
  }

  changeStatusCategorisObjects() {
    let categoryObject;
    if (this.getCategory == null) {
      this.getCategoriesObjects[0].checked = true;
      return;
    }
    for (categoryObject of this.getCategoriesObjects) {
      if (this.getCategory() == categoryObject.name) {
        categoryObject.checked = true;
      } else {
        categoryObject.checked = false;
      }
    }
  }

  get categoryIsFiltered() {
    return (!this.allCategoriesSelected);
  }

  get categories() {
    return this.categoriesObjects;
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

  // get priceIsFiltered() {
  //   return (this.minPrice > 0 || (this.maxPrice > 0 && this.maxPrice < 1800))
  // }

  get menuIsFiltered() {
    return (this.productTypeIsFiltered || this.storesIsFiltered || this.designersIsFiltered || this.priceIsFiltered)
  }

  getCategory() {
    return this.category;
  }

  get getCategoriesObjects() {
    return this.categoriesObjects;
  }

  setProductTypes(item) {
    this.productTypes.push(item.servername);
  }

  setDesigners(designer) {
    this.designers.push(designer.name.toUpperCase());
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

  setAllCheckedButtons() {
    this.setCheckedStores();
    this.setCheckedDesigners();
    this.setCheckedCategory();
    this.setCheckedProductTypes();
  }

  setCheckedStores() {
    let storeName;
    // for (storeID of this.getStores()) {
    //   this.storesObjects[storeID - 1].checked = true;
    // }

    let filteredStored;
    let i = 0;
    for (storeName of this.getStores()) {
      for (filteredStored of this.storesObjects) {
        if (storeName == filteredStored.id) {
          this.storesObjects[i].checked = true;
          i = 0;
          break;
        }
        i++;
      }
    }
  }

  setCheckedDesigners() {
    let designerName;
    let filteredDesigner;
    let i = 0;
    for (designerName of this.getDesigners()) {
      for (filteredDesigner of this.designersObjects) {
        if (designerName == filteredDesigner.name) {
          this.designersObjects[i].checked = true;
          i = 0;
          break;
        }
        i++;
      }
    }

  }

  setCheckedProductTypes() {
    let productTypeName;
    let filteredProduct;
    let i = 0;
    for (productTypeName of this.getProductTypes()) {
      for (filteredProduct of this.clothingProductType) {
        if (productTypeName == filteredProduct.name) {
          this.clothingProductType[i].checked = true;
          i = 0;
          break;
        }
        i++;
      }
    }

  }

  setCheckedCategory() {
    let category;
    let i = 0;
    for (category of this.getCategoriesObjects) {
      if (category.name == this.getCategory()) {
        category.checked = true;
        this.allCategoriesSelected = 0;
      } else {
        category.checked = false;
      }
      i++;
    } if (i == 0) {
      this.categoriesObjects[0].checked = true;
      this.allCategoriesSelected = 1;
    }
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

  removeDesignerByIndex(index) {
    this.getDesigners().splice(index, 1);
  }

  removeDesigner(designer) {
    const index = this.designers.indexOf(designer.name, 0);
    if (index > -1) {
      this.removeDesignerByIndex(index);
    }
    const upperCaseIndex = this.designers.indexOf(designer.name.toUpperCase(), 0);
    if (upperCaseIndex > -1) {
      this.removeDesignerByIndex(upperCaseIndex);
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

  setFilteringDTO(filteringDTO) {
    this.category = filteringDTO.category,
      this.productTypes = filteringDTO.productTypes,
      this.designers = filteringDTO.designers,
      this.stores = filteringDTO.stores,
      this.minPrice = filteringDTO.minPrice,
      this.maxPrice = filteringDTO.maxPrice
  }


}