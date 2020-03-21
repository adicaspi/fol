import { Component, OnInit } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject, Subscription } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-view-discover-people-general',
  templateUrl: './view-discover-people-general.component.html',
  styleUrls: ['./view-discover-people-general.component.scss']
})
export class ViewDiscoverPeopleGeneralComponent implements OnInit {
  discoverPeopleArray = [];
  onDestroy: Subject<void> = new Subject<void>();

  constructor(private feedService: FeedService) { }

  ngOnInit() {
    this.feedService.discoverPeopleGeneral().pipe(takeUntil(this.onDestroy)).subscribe(res => {
      this.discoverPeopleArray = res;
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
  }

}
