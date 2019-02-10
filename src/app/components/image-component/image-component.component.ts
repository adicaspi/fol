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
  @Input() width: string;
  @Input() height: string;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.updatePostImageFd();
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.postImage = reader.result;
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
        console.log('hello');
      },
      error => {
        console.log('error in loading image', error);
      }
    );
    // return this.postService.getImage(post.postImageAddr).then(url => {
    //   this.post_sanitizeURL = url;
    // });
  }
}
