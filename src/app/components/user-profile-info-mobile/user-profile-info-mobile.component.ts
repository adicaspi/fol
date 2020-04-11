import { Component, Input } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../services/dialog.service';
import { ConfigService } from '../../services/config.service';
import { UserProfileInfoComponent } from '../user-profile-info/user-profile-info.component';

@Component({
  selector: 'app-user-profile-info-mobile',
  templateUrl: './user-profile-info-mobile.component.html',
  styleUrls: ['./user-profile-info-mobile.component.scss']
})
export class UserProfileInfoMobileComponent extends UserProfileInfoComponent {
  @Input() user;
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
