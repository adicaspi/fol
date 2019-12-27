import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material';
import { MobileSearchComponent } from './components/mobile-search/mobile-search.component';

const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MatAutocompleteModule
];
const COMPONENTS = [
  MobileSearchComponent
];
const PROVIDERS = [];

@NgModule({
  imports: [
    ...MODULES
  ],
  exports: [
    ...MODULES,
    ...COMPONENTS
  ],
  declarations: [
    ...COMPONENTS
  ]
})
export class SharedModule {
  constructor() {
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders> {
      ngModule: SharedModule,
      providers: [...PROVIDERS]
    };
  }
}
