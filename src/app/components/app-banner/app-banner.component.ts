import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-app-banner',
  templateUrl: './app-banner.component.html',
  styleUrls: ['./app-banner.component.scss']
})
export class AppBannerComponent implements OnInit {
  registeredUser: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
    if (this.userService.userId) {
      this.registeredUser = true;
    }
  }

}
