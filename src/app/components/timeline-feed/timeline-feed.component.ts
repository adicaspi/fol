import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TimelinePost } from '../../models/TimelinePost';
import { Observable } from 'rxjs';
import { FeedService } from '../../services/feed.service';

@Component({
  selector: 'app-timeline-feed',
  templateUrl: './timeline-feed.component.html',
  styleUrls: ['./timeline-feed.component.css']
})
export class TimelineFeedComponent implements OnInit {
  id: number;
  posts: Observable<Array<TimelinePost>>;
  constructor(
    private userService: UserService,
    private feedService: FeedService
  ) {}

  ngOnInit() {
    this.id = this.userService.getCurrentUser();
    this.generateTimelineFeed(0, this.id);
  }

  generateTimelineFeed(offset: number, id: number) {
    this.posts = this.feedService.getTimeLineFeed(id, offset);
    console.log('im posts', this.posts);
  }
}
