import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class LocationService {

  constructor(
    private location: Location,
    private router: Router
  ) {
  }

  goBack() {
    if (window.history.length) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}
