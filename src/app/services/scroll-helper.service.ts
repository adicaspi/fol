import { ViewportScroller } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { delay, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollHelperService {
  private dataLoaded$ = new Subject();

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    combineLatest([
        this.router.events.pipe(
          filter((e: any) => {
            if (e instanceof Scroll) {
              this.runDataLoaded(false);
              return true;
            }

            return false;
          })
        ),
        this.dataLoaded$
    ])
      .pipe(delay(0))
      .subscribe(([event, dataLoaded]: [Scroll, boolean]) => {
        if (event.position && dataLoaded) {
          this.viewportScroller.scrollToPosition(event.position);
        }
      });
  }

  runDataLoaded(value = true) {
    this.dataLoaded$.next(value);
  }
}
