import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserPost } from '../../models/UserPost';
import { FeedService } from '../../services/feed.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-feed',
  templateUrl: './user-feed.component.html',
  styleUrls: ['./user-feed.component.css']
})
export class UserFeedComponent implements OnInit {
  posts: Observable<Array<UserPost>>;
  //posts: Array<UserPost>;
  offset: number;
  id = 0;
  constructor(
    private feedService: FeedService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'];
      this.generateUserFeed(0, this.id);
    });
    // this.posts = [
    //   {
    //     postImageAddr: '../../../assets/bag.jpg',
    //     description: 'Balenciaga Bag'
    //   }
    // ];
    // console.log('im in user feed this is post image adr', this.posts);
  }

  generateUserFeed(offset: number, userId: number) {
    this.posts = this.feedService.getUserFeed(this.id, offset);
    console.log('im posts', this.posts);
  }
}
