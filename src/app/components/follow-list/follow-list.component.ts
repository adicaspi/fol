import { Component, OnInit, Input } from '@angular/core';
import { PostService } from '../../services/post.service';
import { FollowItem } from '../../models/FollowItem';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-follow-list',
  templateUrl: './follow-list.component.html',
  styleUrls: ['./follow-list.component.css']
})
export class FollowListComponent implements OnInit {
  @Input('item') item: FollowItem;

  follows: boolean;
  profile_sanitizeURL: any;

  constructor(
    private postService: PostService,
    private userService: UserService //@Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    console.log('in app-follow-list');
    this.updateProfileImageFd();
    this.checkIsFollowing();
  }

  updateProfileImageFd() {
    // return this.postService.getImage(this.item.profileImageAddr).then(
    //   url => {
    //     this.profile_sanitizeURL = url;
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
  }

  checkIsFollowing() {
    this.userService.checkIsFollowing(this.item.id).subscribe(
      res => {
        this.follows = res;
      },
      error => {
        console.log('im error', error);
      }
    );
  }

  follow() {
    //if user is already following then unfollow
    console.log('in func');
    if (this.follows) {
      this.userService.unFollow(this.item.id);
      this.follows = false;
    } else {
      this.userService.follow(this.item.id);
      this.follows = true;
    }
  }
}
