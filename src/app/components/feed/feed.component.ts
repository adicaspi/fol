import { Component, OnInit, Input } from '@angular/core';
import { TimelinePost } from '../../models/TimelinePost';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  @Input('post') timelinePost: TimelinePost;

  constructor(private postService: PostService) {}

  ngOnInit() {}
}
