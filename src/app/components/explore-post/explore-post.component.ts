import { Component, OnInit, Input } from '@angular/core';
import { ExplorePost } from '../../models/ExplorePost';

@Component({
  selector: 'app-explore-post',
  templateUrl: './explore-post.component.html',
  styleUrls: ['./explore-post.component.css']
})
export class ExplorePostComponent implements OnInit {
  @Input('post') explorePost: ExplorePost;
  @Input('itemClass') itemClass: string;

  constructor() {}

  ngOnInit() {}
}
