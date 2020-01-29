import { Component, OnInit } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-discover-people',
  templateUrl: './discover-people.component.html',
  styleUrls: ['./discover-people.component.scss']
})
export class DiscoverPeopleComponent implements OnInit {
  discoverPeopleArray = [];
  onDestroy: Subject<void> = new Subject<void>();

  constructor(private feedService: FeedService) { }

  ngOnInit() {
    this.feedService.discoverPeople().pipe(takeUntil(this.onDestroy)).subscribe(res => {
      this.discoverPeopleArray = res;
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
  }

}
