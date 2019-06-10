import { Component, OnInit } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { DialogService } from '../../services/dialog.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  routes: Routes = [{ path: 'register', component: RegisterComponent }];
  constructor(private router: Router, private dialogService: DialogService) {}
  // 'use strict';

  ngOnInit() {}

  registerPage() {
    // this.router.navigate(['login']);
    this.dialogService.openDialog(LoginComponent);
  }
}
