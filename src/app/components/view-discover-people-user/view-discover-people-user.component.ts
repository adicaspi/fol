import { Component, OnInit } from '@angular/core';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject, Subscription } from '../../../../node_modules/rxjs';
import { UserService } from '../../services/user.service';
import { ConfigService } from '../../services/config.service';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-view-discover-people-user',
  templateUrl: './view-discover-people-user.component.html',
  styleUrls: ['./view-discover-people-user.component.scss']
})
export class ViewDiscoverPeopleUserComponent implements OnInit {
  discoverPeopleArray = [];
  showNoPostsMessage: boolean = false;
  onDestroy: Subject<void> = new Subject<void>();
  desktop: boolean = true;
  private WindowSizeSubscription: Subscription;

  constructor(private userService: UserService,
    private configService: ConfigService,
    private location: LocationService) { }


  ngOnInit() {
    this.userService.discoverPeopleUser().pipe(takeUntil(this.onDestroy)).subscribe(res => {
      this.discoverPeopleArray = res;
      if (!this.discoverPeopleArray.length) {
        console.log("in no posts");
        this.showNoPostsMessage = true;
      }
    });
    this.WindowSizeSubscription = this.configService.windowSizeChanged.subscribe(
      value => {
        if (value.width <= 900) {
          this.desktop = true;
        }
        if (value.width <= 600) {
          this.desktop = false;
        }
      });
  }

  goBackPage() {
    this.location.goBack();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
  }


}
