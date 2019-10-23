import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeviceDetectorService } from '../../../../node_modules/ngx-device-detector';
import { MutualNavComponent } from '../mutual-nav/mutual-nav.component';
import { ConfigService } from '../../services/config.service';

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
  desktop: Boolean = true;
  classToApply: string = 'center';
  private subscription;
  private anyErrors: boolean;
  private finished: boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private deviceService: DeviceDetectorService,
    private _eref: ElementRef,
    private configService: ConfigService,
  ) { }

  ngOnInit() {
    // if (this.deviceService.isDesktop()) {
    //   this.desktop = true;
    // }
    this.subscription = this.configService.windowSizeChanged.subscribe(
      value => {
        if (value.width <= 600) {
          this.desktop = false;
        }
      }),
      error => this.anyErrors = true,
      () => this.finished = true

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
