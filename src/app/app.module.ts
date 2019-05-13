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
import { MatDialogModule, MatDialogRef } from '@angular/material';
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
import { ProductPageComponent } from './components/product-page/product-page.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { UserService } from './services/user.service';
import { DeferLoadModule } from '@trademe/ng-defer-load';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

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
    ProductPageComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    MatDialogModule,
    BrowserAnimationsModule,
    InfiniteScrollModule,
    DeferLoadModule,
    MaterialDesignModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFontAwesomeModule
  ],

  entryComponents: [
    UserProfileInfoComponent,
    GenerateFollowListComponent,
    ImageComponentComponent,
    ProductPageComponent
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
      useFactory: (configService: ConfigService) => () =>
        configService.getSessionStorgae(),
      deps: [ConfigService, UserService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
