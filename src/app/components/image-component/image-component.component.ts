import { Component, OnInit, Input } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Subscription } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-image-component',
  templateUrl: './image-component.component.html',
  styleUrls: ['./image-component.component.css']
})
export class ImageComponentComponent implements OnInit {
  postImage: any;
  reader = new FileReader();
  @Input('addr') postImageAddr: string;
  @Input('profile') profile: boolean;
  @Input('width') width: string;
  @Input() height: string;
  @Input('class') class: string;

  constructor(private postService: PostService) {}
  showSpinner: boolean = true;
  loaded: boolean = false;
  bg: boolean = true;
  subscription: Subscription;
  ngOnInit() {
    this.updatePostImageFd();
    this.postImage = this.postImageAddr;

    if (!this.class && !this.profile) {
      this.class = 'img-top';
    }
  }

  createImageFromBlob(image: Blob) {
    let handler;
    this.reader.addEventListener(
      'load',
      (handler = () => {
        this.postImage = this.reader.result;
        this.loaded = true;
        //this.bg = false;
        this.reader.removeEventListener('load', handler, false);
        this.showSpinner = false;
      }),
      false
    );

    if (image) {
      this.reader.readAsDataURL(image);
    }
  }

  updatePostImageFd() {
    this.subscription = this.postService.getImage(this.postImageAddr).subscribe(
      data => {
        this.createImageFromBlob(data);
      },
      error => {
        console.log('error in loading image', error);
      }
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
