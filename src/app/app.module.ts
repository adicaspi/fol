import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
    ImageComponentComponent
  ],
  imports: [
    BrowserModule,
    MatDialogModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],

  entryComponents: [UserProfileInfoComponent, GenerateFollowListComponent],

  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {}
