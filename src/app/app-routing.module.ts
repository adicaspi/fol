import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { ViewFeedComponent } from './components/view-feed/view-feed.component';
import { SettingsComponent } from './components/settings/settings.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LandingNavComponent } from './components/landing-nav/landing-nav.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ExploreFeedComponent } from './components/explore-feed/explore-feed.component';
import { ViewExploreComponent } from './components/view-explore/view-explore.component';
import { MutualNavComponent } from './components/mutual-nav/mutual-nav.component';
import { ProductPageMobileComponent } from './components/product-page-mobile/product-page-mobile.component';
import { GenerateFollowListComponent } from './components/generate-follow-list/generate-follow-list.component';
import { LoginComponent } from './components/login/login.component';
import { TermsComponent } from './components/terms/terms.component';
import { TermsCookiesComponent } from './components/terms-cookies/terms-cookies.component';
import { DiscoverPeopleComponent } from './components/discover-people/discover-people.component';
import { ExploreFeedGeneralComponent } from './components/explore-feed-general/explore-feed-general.component';
import { ViewExploreGeneralComponent } from './components/view-explore-general/view-explore-general.component';
import { ViewDiscoverPeopleGeneralComponent } from './components/view-discover-people-general/view-discover-people-general.component';
import { ViewDiscoverPeopleUserComponent } from './components/view-discover-people-user/view-discover-people-user.component';
import { ViewMainProfileComponent } from './components/view-main-profile/view-main-profile.component';
import { ViewFollowListComponent } from './components/view-follow-list/view-follow-list.component';
import { ExternalWebsiteComponent } from './components/external-website/external-website.component';
import {
  AuthGuardService as AuthGuard
} from './services/auth-guard.service';
import { AuthGuradFbService as AuthGuardFB } from './services/auth-gurad-fb.service';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { LoginMethodComponent } from './components/login-method/login-method.component';
import { CollectionsComponent } from './components/collections/collections.component';
import { UserCollectionComponent } from './components/user-collection/user-collection.component';



const routes: Routes = [
  // {
  //   path: '',
  //   component: ViewFeedComponent,
  //   //canActivate: [AuthGuardFB],

  // },
  {
    path: '',
    component: LoginMethodComponent,
    //canActivate: [AuthGuardFB],

  },

  {
    path: 'instagram',
    component: ExternalWebsiteComponent
  },
  { path: 'desktop-profile/:id', component: ViewMainProfileComponent },


  {
    path: 'profile/:id',
    component: ViewProfileComponent
  },
  {
    path: 'feed/:id', component: ViewFeedComponent,
    //canActivate: [AuthGuard]
  },


  {
    path: 'settings/:id',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },


  { path: 'forgotpassword', component: ForgotPasswordComponent },
  {
    path: 'explore/:id', component: ViewExploreComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'general-explore', component: ViewExploreGeneralComponent
  },
  {
    path: 'product-page/:id', component: ProductPageMobileComponent
  },
  { path: 'following', component: GenerateFollowListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'cookies-policy', component: TermsCookiesComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  {
    path: 'feed-discover-people', component: ViewDiscoverPeopleGeneralComponent
  },
  {
    path: 'discover-people-user/:id', component: ViewDiscoverPeopleUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'follow-list/:id', component: ViewFollowListComponent,
    canActivate: [AuthGuard]
  },
  { path: 'landing', component: ExternalWebsiteComponent },
  { path: 'embed/collection/:id', component: CollectionsComponent },
  { path: 'user-collection/:id', component: UserCollectionComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
