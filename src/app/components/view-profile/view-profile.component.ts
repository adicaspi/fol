import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeviceDetectorService } from '../../../../node_modules/ngx-device-detector';
import { MutualNavComponent } from '../mutual-nav/mutual-nav.component';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css'],
  host: {
    '(document:click)': 'onClick($event)'
  }
})
export class ViewProfileComponent implements OnInit {
  @ViewChild(MutualNavComponent, { static: false })
  mutualNav: MutualNavComponent;
  desktop: Boolean;
  classToApply: string = 'center';
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private deviceService: DeviceDetectorService,
    private _eref: ElementRef
  ) {}

  ngOnInit() {
    if (this.deviceService.isDesktop()) {
      this.desktop = true;
    }
  }

  // countChange(event) {
  //   this.classToApply = event;
  // }

  // onClick(event) {
  //   if (this._eref.nativeElement.contains(event.target))
  //     console.log('in click event');
  //   if (this.mutualNav.openDropDownKey) {
  // or some similar check

  // this.mutualNav.prevOpenKey.css({
  //   display: 'none'
  // });
  //}
  //  }
}
