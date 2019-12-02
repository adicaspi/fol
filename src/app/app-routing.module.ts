import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
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

const routes: Routes = [
  { path: 'feed/:id', component: ViewFeedComponent },
  {
    path: 'profile/:id',
    component: ViewProfileComponent
  },
  {
    path: 'settings/:id',
    component: SettingsComponent
  },
  // {
  //   path: 'login',
  //   component: MutualNavComponent
  // },
  {
    path: '',
    component: ViewFeedComponent
  },
  {
    path: 'landing',
    component: LandingPageComponent
  },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'explore/:id', component: ViewExploreComponent },
  { path: 'product-page', component: ProductPageMobileComponent },
  { path: 'following', component: GenerateFollowListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }), HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
