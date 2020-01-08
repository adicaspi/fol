import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeedComponent } from './components/feed/feed.component';
import { TimelineFeedComponent } from './components/timeline-feed/timeline-feed.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { UserFeedComponent } from './components/user-feed/user-feed.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ViewFeedComponent } from './components/view-feed/view-feed.component';
import { EMenuComponent } from './components/e-menu/e-menu.component';
import { UserProfileInfoComponent } from './components/user-profile-info/user-profile-info.component';
import { SettingsComponent } from './components/settings/settings.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { GenerateFollowListComponent } from './components/generate-follow-list/generate-follow-list.component';
import { FollowListComponent } from './components/follow-list/follow-list.component';
import { ImageComponentComponent } from './components/image-component/image-component.component';
import { MatDialogModule, MatDialogRef, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatMenuModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpErrorComponent } from './interceptor/http-error/http-error.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { ErrorHandlerComponent } from './components/error-handler/error-handler.component';
import { ConfigService } from './services/config.service';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { LandingNavComponent } from './components/landing-nav/landing-nav.component';
import { MutualNavComponent } from './components/mutual-nav/mutual-nav.component';
import { XsrfInterceptorComponent } from './interceptor/xsrf-interceptor/xsrf-interceptor.component';
import { MaterialDesignModule } from './material-design/material-design.module';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { UserService } from './services/user.service';
import { DeferLoadModule } from '@trademe/ng-defer-load';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ExploreFeedComponent } from './components/explore-feed/explore-feed.component';
import { ExplorePostComponent } from './components/explore-post/explore-post.component';
import { ViewExploreComponent } from './components/view-explore/view-explore.component';
import { NgxMasonryModule } from 'ngx-masonry';
import { LoginComponent } from './components/login/login.component';
import { ShoppingNavComponent } from './components/shopping-nav/shopping-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { ProductPageMobileComponent } from './components/product-page-mobile/product-page-mobile.component';
import { FilePreviewOverlayComponent } from './components/file-preview-overlay/file-preview-overlay.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { DialogService } from './services/dialog.service';
import { Ng5SliderModule } from 'ng5-slider';
import { ErrorsService } from './services/errors.service';
import { SlideshowModule } from 'ng-simple-slideshow';
import { BottomNavbarComponent } from './components/bottom-navbar/bottom-navbar.component';
import { IgxSliderModule } from 'igniteui-angular';
import { FollowingListMobileComponent } from './components/following-list-mobile/following-list-mobile.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatExpansionModule } from '@angular/material/expansion';
import { HeightWidthRatioDirective } from './directives/height-width-ratio.directive';
import { LoginMobileComponent } from './components/login-mobile/login-mobile.component';
import { SharedModule } from './shared/shared.module';
import { UserProfileInfoMobileComponent } from './components/user-profile-info-mobile/user-profile-info-mobile.component';
import { UserProfileInfoDesktopComponent } from './components/user-profile-info-desktop/user-profile-info-desktop.component';
import { ThousandSuffixesPipe } from './components/product-page-mobile/pipe-transform';


//I keep the new line
@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    TimelineFeedComponent,
    ViewProfileComponent,
    UserFeedComponent,
    NavbarComponent,
    ProfileComponent,
    ViewFeedComponent,
    EMenuComponent,
    UserProfileInfoComponent,
    SettingsComponent,
    RegisterComponent,
    GenerateFollowListComponent,
    FollowListComponent,
    ImageComponentComponent,
    HttpErrorComponent,
    ErrorHandlerComponent,
    LandingNavComponent,
    MutualNavComponent,
    XsrfInterceptorComponent,
    ForgotPasswordComponent,
    LoadingSpinnerComponent,
    LandingPageComponent,
    ExploreFeedComponent,
    ExplorePostComponent,
    ViewExploreComponent,
    LoginComponent,
    ShoppingNavComponent,
    ProductPageMobileComponent,
    FilePreviewOverlayComponent,
    BottomNavbarComponent,
    FollowingListMobileComponent,
    HeightWidthRatioDirective,
    LoginMobileComponent,
    UserProfileInfoMobileComponent,
    UserProfileInfoDesktopComponent
  ],
  imports: [
    BrowserModule,
    MatDialogModule,
    BrowserAnimationsModule,
    InfiniteScrollModule,
    MatExpansionModule,
    DeferLoadModule,
    MaterialDesignModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    NgxMasonryModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    Ng5SliderModule,
    SlideshowModule,
    IgxSliderModule,
    ScrollingModule,
    ThousandSuffixesPipe,
    DeviceDetectorModule.forRoot(),
    SharedModule.forRoot()
  ],

  entryComponents: [
    //UserProfileInfoComponent,
    // GenerateFollowListComponent,
    ImageComponentComponent,
    RegisterComponent,
    LoginComponent,
    FilePreviewOverlayComponent,
    MutualNavComponent,
    ShoppingNavComponent,
    ViewFeedComponent,
    ViewProfileComponent,
    TimelineFeedComponent

  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: XsrfInterceptorComponent,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorComponent,
      multi: true
    },

    { provide: ErrorHandler, useClass: ErrorHandlerComponent },
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: ConfigService) => () => configService.getSessionStorgae(),
      deps: [ConfigService, UserService],
      multi: true
    },
    { provide: 'windowObject', useValue: window },
    ConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
