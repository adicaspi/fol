import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { UserProfileInfoComponent } from '../user-profile-info/user-profile-info.component';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { DialogService } from '../../services/dialog.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-user-profile-info-desktop',
  templateUrl: './user-profile-info-desktop.component.html',
  styleUrls: ['./user-profile-info-desktop.component.scss']
})
export class UserProfileInfoDesktopComponent extends UserProfileInfoComponent {

  constructor(public userService: UserService,
    public activatedRoute: ActivatedRoute,
    public dialogService: DialogService,
    public router: Router,
    public configService: ConfigService,
    public location: LocationService
  ) {
    super(userService, activatedRoute, dialogService, router, configService, location);
  }

}
