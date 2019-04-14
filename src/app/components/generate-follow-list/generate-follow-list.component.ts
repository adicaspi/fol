import { Component, OnInit, Input, Inject } from '@angular/core';
import { FollowItem } from '../../models/FollowItem';
import { Observable } from 'rxjs';
import { FeedService } from '../../services/feed.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { element } from '../../../../node_modules/@angular/core/src/render3';
@Component({
  selector: 'app-generate-follow-list',
  templateUrl: './generate-follow-list.component.html',
  styleUrls: ['./generate-follow-list.component.css']
})
export class GenerateFollowListComponent implements OnInit {
  followsFeed: Observable<Array<FollowItem>>;
  //followingFeed: Observable<Array<FollowItem>>;
  id: number;
  offset: number;
  flag: number;
  constructor(
    private feedService: FeedService,
    private activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<GenerateFollowListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.flag = this.data.flag;
    console.log('im flag', this.flag);
    this.id = this.data.id;
    this.generateFollowsFeed(0);
  }

  generateFollowsFeed(offset: number) {
    console.log('in generate follows feed im flag', this.flag, this.id);
    this.followsFeed = this.feedService.getSlavesMasters(
      this.id,
      offset,
      this.flag
    );
  }

  follow() {
    //if user is already following then unfollow
    console.log('in func');
    // if (this.follows) {
    //   this.userService.unFollow(this.item.id);
    //   this.follows = false;
    // } else {
    //   this.userService.follow(this.item.id);
    //   this.follows = true;
    // }
  }
}
