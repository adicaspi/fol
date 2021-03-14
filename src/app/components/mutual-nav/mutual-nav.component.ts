import { Component, OnInit, Output, EventEmitter, ViewEncapsulation, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatRadioChange, MatRadioButton, MatMenuTrigger, MatCheckboxChange } from '@angular/material';
import { SliderType } from "igniteui-angular";
import { FilteringDTO } from '../../models/FilteringDTO';
import { FeedService } from '../../services/feed.service';
import { Router } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { ShoppingNavService } from '../../services/shopping-nav.service';



@Component({
  selector: 'app-mutual-nav',
  templateUrl: './mutual-nav.component.html',
  styleUrls: ['./mutual-nav.component.css'],

})
export class MutualNavComponent implements OnInit {
  @Output()
  change: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild(MatMenuTrigger, { static: false }) categoryController: MatMenuTrigger;
  @ViewChildren(MatMenuTrigger) trigger: QueryList<MatMenuTrigger>;
  @ViewChild('categoryButton', { static: false }) categoryButton: ElementRef;
  @ViewChild('productButton', { static: false }) productButton: ElementRef;
  @ViewChild('designerButton', { static: false }) designerButton: ElementRef;
  @ViewChild('storeButton', { static: false }) storeButton: ElementRef;
  @ViewChild('priceButton', { static: false }) priceButton: ElementRef;

  public sliderType = SliderType;
  public priceRange: PriceRange = new PriceRange(0, 5000);
  minValue: number;
  maxValue: number;
  categoryForm: FormGroup;
  productForm: FormGroup;
  categroyRadioButton: MatRadioButton = null;
  allCategroiesRadioButton: MatRadioButton = null;
  showProduct: boolean = false;
  filteringDTO = new FilteringDTO();
  currentFilters = {};
  menuChanged: boolean = false;
  categories = [];
  clothing = [];
  designers = [];
  stores;
  productsToShow = [];
  componentName: ComponentName;

  constructor(private formBuilder: FormBuilder, private feedService: FeedService, private massageService: MessageService, private router: Router, private shoppingNavService: ShoppingNavService) { }

  ngOnInit() {
    this.minValue = 0;
    this.maxValue = 1800;
    if (this.router.url.includes("feed")) {
      this.componentName = ComponentName.Feed;
      this.filteringDTO.setFilteringDTO(this.feedService.feedFilteringDTO.getFilteringDTO());
    } if (this.router.url.includes("profile")) {
      if (this.router.url.includes("profile/")) {
        this.componentName = ComponentName.Profile;
        this.filteringDTO.setFilteringDTO(this.feedService.profileFilteringDTO.getFilteringDTO());
      } else {
        this.componentName = ComponentName.MainProfile;
        this.filteringDTO.setFilteringDTO(this.feedService.mainProfileFilteringDTO.getFilteringDTO());
      }
    } if (this.router.url.includes("explore")) {
      this.componentName = ComponentName.Explore;
      this.filteringDTO.setFilteringDTO(this.feedService.exploreFilteringDTO.getFilteringDTO());
    }
    if (this.router.url.includes("general")) {
      this.componentName = ComponentName.GeneralExplore;
      this.filteringDTO.setFilteringDTO(this.feedService.exploreGeneralFilteringDTO.getFilteringDTO());
    }
    this.filteringDTO.setAllCheckedButtons();
    this.priceRange.lower = this.filteringDTO.minPrice;
    this.priceRange.upper = this.filteringDTO.maxPrice;

    if (this.filteringDTO.categoryIsFiltered) {
      this.showProduct = true;
    }
    // this.categories = [{ id: 1, name: 'All Categories', checked: true }, { id: 2, name: 'Clothing', checked: false }, { id: 3, name: 'Shoes', checked: false }, { id: 4, name: 'Bags', checked: false }, { id: 5, name: 'Accessories', checked: false }];
    this.updateFeedFilteringDTO();


    this.categoryForm = this.formBuilder.group({
      category: ['']
    });
    this.productForm = this.formBuilder.group({
      Clothings: [''],
      Shoes: [''],
      Bags: [''],
      Accesories: ['']
    });
  }

  menuClosed() {
    if (this.menuChanged) {
      this.updateFeedFilteringDTO();
      this.menuChanged = false;
    }
  }

  categoryMenuClosed() {
    if (this.menuChanged) {
      this.updateFeedFilteringDTO();
      this.menuChanged = false;
    } else {
      if (this.filteringDTO.categoryIsFiltered) {
        this.categoryMenuOpened();
      } else {
        this.categoryButton.nativeElement.className = 'filter-button';
      }
    }
  }

  productMenuClosed() {
    if (this.menuChanged) {
      this.updateFeedFilteringDTO();
      this.menuChanged = false;
    } else {
      if (this.filteringDTO.productTypeIsFiltered) {
        this.productMenuOpened();
      } else {
        this.productButton.nativeElement.className = 'filter-button';
      }
    }
  }

  designerMenuClosed() {
    if (this.menuChanged) {
      this.updateFeedFilteringDTO();
      this.menuChanged = false;
    } else {
      if (this.filteringDTO.designersIsFiltered) {
        this.designerMenuOpened();
      } else {
        this.designerButton.nativeElement.className = 'filter-button';
      }
    }
  }

  storeMenuClosed() {
    if (this.menuChanged) {
      this.updateFeedFilteringDTO();
      this.menuChanged = false;
    } else {
      if (this.filteringDTO.storesIsFiltered) {
        this.storeMenuOpened();
      } else {
        this.storeButton.nativeElement.className = 'filter-button';
      }
    }
  }

  priceMenuClosed() {
    if (this.menuChanged) {
      this.filteringDTO.minPrice = this.priceRange.lower;
      this.filteringDTO.maxPrice = this.priceRange.upper;
      this.updateFeedFilteringDTO();
      this.menuChanged = false;
    }
    if ((this.priceRange.lower > 0) || (this.priceRange.upper < 1800)) {
      this.priceMenuOpened();
    } else {
      this.priceButton.nativeElement.className = 'filter-button';
    }
  }


  categoryMenuOpened() {
    this.categoryButton.nativeElement.className = 'filter-button checked';
  }

  productMenuOpened() {
    this.productButton.nativeElement.className = 'filter-button checked';
  }

  designerMenuOpened() {
    this.designerButton.nativeElement.className = 'filter-button checked';
  }

  storeMenuOpened() {
    this.storeButton.nativeElement.className = 'filter-button checked';
  }

  priceMenuOpened() {
    this.priceButton.nativeElement.className = 'filter-button checked';
  }

  categoryValue() {
    let val = this.categoryForm.get('category');
  }

  clearCategoryForm() {
    if (this.categroyRadioButton) {
      this.categroyRadioButton.checked = false;
    }
  }

  onChange(mrChange: MatRadioChange) {
    if (mrChange.value == "All Categories") {
      this.filteringDTO.setCategory(null);
      this.filteringDTO.allCategoriesSelected = 1;
    }
    else {
      this.filteringDTO.setCategory(mrChange.value);
      this.filteringDTO.allCategoriesSelected = 0;
    }
    if (mrChange.value == 'Clothing') {
      this.showProduct = true;
      switch (mrChange.value) {
        case "Clothing":
          this.productsToShow = this.clothing;
          break;
      }
    } else {
      this.showProduct = false;
      this.filteringDTO.clearProductType();
    }
    this.updateFeedFilteringDTO();
  }

  onChangeCheckBox(key, $event, elem) {
    this.menuChanged = true;
    if ($event.checked == true) {
      elem.checked = true;
      this.filtering(key, elem, true);
    }
    else {
      elem.checked = false;
      this.filtering(key, elem, false)
    }
  }

  filtering(key, elem, checked) {
    switch (key) {
      case "products":
        if (checked) {
          this.filteringDTO.setProductTypes(elem);
        }
        else {
          this.filteringDTO.removeProduct(elem);
        }
        break;
      case "designers":
        if (checked) {
          this.filteringDTO.setDesigners(elem);
        }
        else {
          this.filteringDTO.removeDesigner(elem);
        }
        break;
      case "stores":
        if (checked) {
          this.filteringDTO.setStores(elem);
        }
        else {
          this.filteringDTO.removeStore(elem);
        }
        break;
    }
  }

  selectedProduct() {
  }

  selectedStore() {
  }

  selectedDesigner() {
  }

  selectedPrice() {
    this.priceMenuClosed();
  }

  changePrice($event) {
    this.menuChanged = true;
    this.filteringDTO.setMinPrice($event.value.lower);
    this.filteringDTO.setMaxPrice($event.value.upper);
  }

  clearSelection(filteringDTOarray) {

    switch (filteringDTOarray) {
      case "productTypes":
        this.filteringDTO.clearProductType();
        break;
      case "designers":
        this.filteringDTO.clearDesigners();
        break;
      case "stores":
        this.filteringDTO.clearStores();
    }
    this.menuChanged = true;
    this.menuClosed();
  }

  updateFeedFilteringDTO() {
    console.log("udated feed mututal nav");
    this.feedService.offset = 0;
    if (this.componentName == ComponentName.Feed) {
      this.feedService.feedFilteringDTO.setFilteringDTO
        (this.filteringDTO.getFilteringDTO());
    }
    if (this.componentName == ComponentName.Profile) {
      this.feedService.profileFilteringDTO.setFilteringDTO(this.filteringDTO.getFilteringDTO());
    }
    if (this.componentName == ComponentName.Explore) {
      this.feedService.exploreFilteringDTO.setFilteringDTO(this.filteringDTO.getFilteringDTO());
    }
    if (this.componentName == ComponentName.MainProfile) {
      this.feedService.mainProfileFilteringDTO.setFilteringDTO(this.filteringDTO.getFilteringDTO());
    }
    this.massageService.sendMessage('update-feed');
    //this.massageService.clearMessage();
  }

}

class PriceRange {
  constructor(
    public lower: number,
    public upper: number
  ) {
  }
}

enum ComponentName {
  Feed,
  Profile,
  MainProfile,
  Explore,
  GeneralExplore
}