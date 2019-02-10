import { Component, OnInit, Input } from '@angular/core';
import { UserPost } from '../../models/UserPost';
import { PostService } from '../../services/post.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
