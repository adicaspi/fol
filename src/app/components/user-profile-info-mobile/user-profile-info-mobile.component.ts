import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { DialogService } from '../../services/dialog.service';
import { ConfigService } from '../../services/config.service';
import { UserProfileInfoComponent } from '../user-profile-info/user-profile-info.component';

@Component({
  selector: 'app-user-profile-info-mobile',
  templateUrl: './user-profile-info-mobile.component.html',
  styleUrls: ['./user-profile-info-mobile.component.scss']
})
export class UserProfileInfoMobileComponent extends UserProfileInfoComponent {

  constructor(public userService: UserService,
    public activatedRoute: ActivatedRoute,
    public dialogService: DialogService,
    public router: Router,
    public configService: ConfigService) {
    super(userService, activatedRoute, dialogService, router, configService);
  }

}
