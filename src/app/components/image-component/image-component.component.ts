import { Component, OnInit, Input } from '@angular/core';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-image-component',
  templateUrl: './image-component.component.html',
  styleUrls: ['./image-component.component.css']
})
export class ImageComponentComponent implements OnInit {
  postImage: any;
  @Input('addr') postImageAddr: string;
  @Input('profile') profile: boolean;
  @Input('width') width: string;
  @Input() height: string;
  @Input('class') class: string;

  constructor(private postService: PostService) {}
  showSpinner: boolean = true;
  loaded: boolean = false;
  ngOnInit() {
    console.log('Class is', this.class);
    this.updatePostImageFd();
    this.postImage = this.postImageAddr;

    if (!this.class && !this.profile) {
      this.class = 'card-img-top';
    }
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.postImage = reader.result;
        this.loaded = true;

        this.showSpinner = false;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  updatePostImageFd() {
    this.postService.getImage(this.postImageAddr).subscribe(
      data => {
        this.createImageFromBlob(data);
      },
      error => {
        console.log('error in loading image', error);
      }
    );
  }
}
