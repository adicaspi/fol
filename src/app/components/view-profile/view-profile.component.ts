import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeviceDetectorService } from '../../../../node_modules/ngx-device-detector';
import { MutualNavComponent } from '../mutual-nav/mutual-nav.component';
import { ConfigService } from '../../services/config.service';
import { ErrorsService } from '../../services/errors.service';
import { NavbarComponent } from '../navbar/navbar.component';
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
  @ViewChild(MutualNavComponent, { static: false })
  @ViewChild(NavbarComponent, { static: false })

  mutualNav: MutualNavComponent;
  desktop: Boolean = true;
  classToApply: string = 'center';
  firstChar: boolean = true;
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  private subscription;
  private anyErrors: boolean;
  private finished: boolean;
  searchedTouched: boolean = false;
  error: string;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private deviceService: DeviceDetectorService,
    private _eref: ElementRef,
    private configService: ConfigService,
    private errorService: ErrorsService,
    private userService: UserService
  ) { }

  ngOnInit() {
    // if (this.deviceService.isDesktop()) {
    //   this.desktop = true;
    // }
    this.subscription = this.errorService.getMessage().subscribe(msg => {
      console.log('im msg', msg.error);
      if (msg.error == "") {
        this.firstChar = true;
        this.options = [];
        this.filteredOptions = this._filter(msg.error);
        this.searchedTouched = false;
      }
      if (this.firstChar && msg.error != "") {
        this.getSearchResults(msg.error);
        this.firstChar = false;
        this.searchedTouched = true;
      }
      if (!this.firstChar) {
        this.filteredOptions = this._filter(msg.error);
        this.searchedTouched = true;
      }

    })

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

  getSearchResults(value: string) {
    this.userService.search(value).subscribe(res => {
      res.forEach(element => {
        this.options.push(element.username);
      })
      this.filteredOptions = this._filter(value)
    })
  }

  private _filter(value: string): Observable<string[]> {
    const filterValue = value.toLowerCase();
    return Observable.of(this.options.filter(option => option.toLowerCase().includes(filterValue)));
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
