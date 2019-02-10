import { Component, OnInit, Input } from '@angular/core';
import { UserPost } from '../../models/UserPost';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile_sanitizeURL: SafeUrl;
  post_sanitizeURL: SafeUrl;
  @Input('post') userPost: UserPost;

  constructor(
    private postService: PostService,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.updatePostImageFd(this.userPost);
  }
  async updatePostImageFd(post: UserPost) {
    // this.postService.getImage(post.postImageAddr).then(url => {
    //   this.post_sanitizeURL = url;
    // });
  }
}
