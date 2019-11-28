import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { ViewProfileComponent } from '../view-profile/view-profile.component';
import { RegisterComponent } from '../register/register.component';
import { SettingsComponent } from '../settings/settings.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatMenuTrigger } from '@angular/material';
import { MutualNavComponent } from '../mutual-nav/mutual-nav.component';
import { ConfigService } from '../../services/config.service';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ErrorsService } from '../../services/errors.service';
import { GlobalVariable } from '../../../global';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  //  @ViewChild(MatMenuTrigger, { static: false }) menu: MatMenuTrigger;
  searchForm: FormGroup;
  firstChar: boolean = true;
  options = [];
  filteredOptions: Observable<any>;
  enabled: boolean = false;
  menuIsClosed: boolean = true;
  loggedin = false;
  feed: boolean = false;
  masterId: number;
  userId: number;
  explore: boolean = false;
  profile: boolean = false;
  mobile: boolean = false;
  routes: Routes = [
    { path: 'profile/:id', component: ViewProfileComponent },
    { path: '', component: RegisterComponent },
    { path: 'settings/:id', component: SettingsComponent }
  ];
  private subscription;
  private anyErrors: boolean;
  private finished: boolean;
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  onDestroy: Subject<void> = new Subject<void>();
  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private deviceService: DeviceDetectorService,
    private configService: ConfigService,
    private formBuilder: FormBuilder,
    private errorService: ErrorsService
  ) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      search: ['']
    })
    this.onChanges();
    // this.errorService.filteredOptions = this.searchForm.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._filter(value))
    //   );
    const routeParams = this.activatedRoute.snapshot.params;
    this.masterId = parseInt(routeParams.id);
    this.userId = this.userService.userId;
    if (this.router.url.includes('profile')) {
      if (this.userId == this.masterId) {
        this.profile = true;
      }
    }
    if (this.router.url.includes('feed')) {
      this.feed = true;
    }
    if (this.router.url.includes('explore')) {
      this.explore = true;
    }
    if (this.userService.userId) {
      this.loggedin = true;
    }
    this.subscription = this.configService.windowSizeChanged.pipe(takeUntil(this.onDestroy)).subscribe(
      value => {
        if (value.width <= 600) {
          this.mobile = true;
        }
      }),
      error => this.anyErrors = true,
      () => this.finished = true


    // if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
    //   this.mobile = true;
    // }
  }

  onChanges(): void {

    this.searchForm.controls['search'].valueChanges.pipe(takeUntil(this.onDestroy)).subscribe(value => {
      if (value != "") {
        this.getSearchResults(value);
      }
    })
  }

  setSearchInput(value: string) {
    if (value == "") {
      this.firstChar = true;
      this.options = [];
      this.filteredOptions = this._filter(value);
      // this.showSearchSubject.next(false);

    }
    if (this.firstChar && value != "") {
      this.getSearchResults(value);
      this.firstChar = false;
    }
    if (!this.firstChar) {
      this.filteredOptions = this._filter(value);
    }
  }

  getSearchResults(value: string) {
    let baseAPI = this.baseApiUrl + '/image?s3key=';
    this.userService.search(value).subscribe(res => {
      this.options = [];
      res.forEach(element => {
        let searchObject = {
          fullName: element.fullName,
          userName: element.username,
          profileImgSrc: baseAPI + element.userProfileImageAddr,
          id: element.id
        };
        this.options.push(searchObject);
      })
      //this.filteredOptions = this._filter(value);
    })
  }

  private _filter(value: string): Observable<any> {
    const filterValue = value.toLowerCase();
    return Observable.of(
      this.options.filter(option => option.userName.toLowerCase().includes(filterValue))
    );
  }

  searchUser(searchResult) {
    this.router.navigate(['profile', searchResult.id]);
  }

  profilePage() {
    this.router.navigate(['profile', this.userService.userId]);
  }

  settingsPage() {
    this.searchForm.reset();
    this.router.navigate(['settings', this.userService.userId]);
  }

  feedPage() {
    this.router.navigate(['feed', this.userService.userId]);
  }

  explorePage() {
    this.router.navigate(['/explore', this.userService.userId]);
  }


  openCloseMenu() {
    if (this.menuIsClosed) {
      this.menuIsClosed = false;
    }
    else {
      //this.menu.closeMenu();
      this.menuIsClosed = true;
    }

  }
}
