import { Component, OnInit, HostListener } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import { ConfigService } from '../../services/config.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject, Subscription } from '../../../../node_modules/rxjs';
import * as jquery from 'jquery';
import { Router } from '../../../../node_modules/@angular/router';
import { UserService } from '../../services/user.service';
import { Title, Meta } from '../../../../node_modules/@angular/platform-browser';

@Component({
  selector: 'app-view-discover-people-general',
  templateUrl: './view-discover-people-general.component.html',
  styleUrls: ['./view-discover-people-general.component.scss']
})
export class ViewDiscoverPeopleGeneralComponent implements OnInit {
  discoverPeopleArray = [];
  didTransform: boolean = false;
  desktop: boolean = true;
  onDestroy: Subject<void> = new Subject<void>();
  private WindowSizeSubscription: Subscription;

  constructor(private feedService: FeedService,
    private configService: ConfigService,
    private userService: UserService,
    private router: Router,
    private titleService: Title,
    private meta: Meta) { }

  ngOnInit() {
    this.titleService.setTitle('Discover People General');
    this.meta.addTag({ name: 'robots', content: 'noimageindex, noarchive' });
    this.feedService.discoverPeopleGeneral().pipe(takeUntil(this.onDestroy)).subscribe(res => {
      this.discoverPeopleArray = res;
    });

    this.WindowSizeSubscription = this.configService.windowSizeChanged
      .subscribe(
        value => {
          if (value.width > 600) {
            this.desktop = true;
          }

          if (value.width <= 600) {
            this.desktop = false;
          }
        });
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    if (!this.didTransform) {
      jquery(".button-container").css("opacity", 1);
      jquery(".button-container").css("bottom", "40px");
      this.didTransform = true;
    }
  }

  continue() {
    this.router.navigate(['feed', this.userService.userId]);
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
  }

}
