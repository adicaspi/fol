import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { debounceTime, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { SearchItem } from '../../../models/SearchItem';
import { UserService } from '../../../services/user.service';

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

@Component({
  selector: 'fw-mobile-search',
  templateUrl: 'mobile-search.component.html',
  styleUrls: ['./mobile-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
    useFactory: scrollFactory,
    deps: [Overlay]
  }]
})
export class MobileSearchComponent implements OnInit, OnDestroy {
  options: SearchItem[] = [];
  searchControl = new FormControl('');
  placeholder = 'Search';
  isLoading = false;
  isCancelBtnVisible = false;
  @ViewChild('auto', {static: false}) autocompleteRef: MatAutocomplete;
  @ViewChild('search', {static: false}) inputElement: ElementRef;
  @ViewChild('search', {static: false, read: MatAutocompleteTrigger}) autocompleteTrigger: MatAutocompleteTrigger;
  private onDestroy: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.handleUsersSearch();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  private handleUsersSearch() {
    this.searchControl.valueChanges
      .pipe(
        tap(() => {
          this.isLoading = true;
          this.cd.detectChanges();
        }),
        debounceTime(300),
        switchMap((value) => {
          return this.loadUsers(value).pipe(
            finalize(() => {
              this.isLoading = false;
              this.cd.detectChanges();
            })
          );
        }),
        takeUntil(this.onDestroy)
      )
      .subscribe(resp => {
        this.options = resp;
      });
  }

  private loadUsers(value) {
    if (!value) {
      return of([]);
    }
    return this.userService.search(value).pipe(
      map((items) => items.map(item => new SearchItem(item)))
    );
  }

  onInputFocus() {
    this.isCancelBtnVisible = true;
  }

  onClearInput(event) {
    event.stopPropagation();
    this.searchControl.setValue('');
    this.options = [];
    this.inputElement.nativeElement.focus();
    this.cd.detectChanges();
  }

  onGoToUser(user) {
    this.router.navigate(['profile', user.id]);
  }

  onCancelSearch() {
    this.searchControl.setValue('');
    this.options = [];
    this.isCancelBtnVisible = false;
    this.cd.detectChanges();
  }

  get hasValue() {
    return !!this.searchControl.value.length;
  }
}
