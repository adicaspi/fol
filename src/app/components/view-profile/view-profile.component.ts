import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ConfigService } from '../../services/config.service';
import { ErrorsService } from '../../services/errors.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css'],
  host: {
    '(document:click)': 'onClick($event)'
  }
})
export class ViewProfileComponent implements OnInit {
  desktop: boolean = true;
  classToApply: string = 'center';
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  searchedTouched: Observable<boolean>;
  mobileSearchedTouched: Observable<boolean>;
  private subscription;
  private anyErrors: boolean;
  private finished: boolean;
  height: string = '400px';
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private deviceService: DeviceDetectorService,
    private configService: ConfigService,
    private errorService: ErrorsService
  ) { }

  ngOnInit() {
    this.subscription = this.configService.windowSizeChanged.subscribe(
      value => {
        if (value.width <= 600) {
          this.desktop = false;
        }
        else {
          this.desktop = true;
        }
      }),
      error => this.anyErrors = true,
      () => this.finished = true
  }
}
