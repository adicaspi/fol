import { Component, OnInit, Input } from '@angular/core';
import { TimelinePost } from '../../models/TimelinePost';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  @Input('post') timelinePost: TimelinePost;

  constructor(private dialogService: DialogService) { }

  ngOnInit() { }

}
