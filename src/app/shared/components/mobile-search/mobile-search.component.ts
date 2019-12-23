import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener, OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { debounceTime, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { SearchItem } from '../../../models/SearchItem';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'fw-mobile-search',
  templateUrl: 'mobile-search.component.html',
  styleUrls: ['./mobile-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileSearchComponent implements OnInit, OnDestroy {
  options: SearchItem[] = [];
  searchControl = new FormControl('');
  isVisibleStaticInput = true;
  placeholder = 'Search';
  isLoading = false;
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

  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    const isClickedOnSearch = event.path.some(item => item.className && item.className.includes('mobile-search-container'));
    if (isClickedOnSearch) {
      return;
    }

    this.isVisibleStaticInput = true;
  }

  onClickPlaceholder(event) {
    event.stopPropagation();
    this.isVisibleStaticInput = false;

    if (this.inputElement && this.inputElement.nativeElement) {
      this.inputElement.nativeElement.focus();
    }
  }

  onResetInput() {
    this.searchControl.setValue('');
    this.isVisibleStaticInput = true;
    this.options = [];
  }

  onGoToUser(user) {
    this.router.navigate(['profile', user.id]);
  }
}
