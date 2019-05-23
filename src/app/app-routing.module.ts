import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { ViewFeedComponent } from './components/view-feed/view-feed.component';
import { SettingsComponent } from './components/settings/settings.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
import { LandingNavComponent } from './components/landing-nav/landing-nav.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
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
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '',
    component: LandingPageComponent
  },
  { path: 'forgotpassword', component: ForgotPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule {}
