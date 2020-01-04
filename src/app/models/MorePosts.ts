import { environment } from '../../environments/environment';

export class MorePosts {
  postId: number;
  postImageAddr: string;
  private baseApiUrl = environment.BASE_API_URL;

  constructor(
    postId: number,
    postImageAddr: string
  ) {
    this.postId = postId;
    this.postImageAddr = this.baseApiUrl + '/image?s3key=' + postImageAddr;

  }
}
