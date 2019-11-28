import { GlobalVariable } from '../../global';
import { post } from 'selenium-webdriver/http';

export class MorePosts {
  postId: number;
  postImageAddr: string;
  private baseApiUrl = GlobalVariable.BASE_API_URL;

  constructor(
    postId: number,
    postImageAddr: string
  ) {
    this.postId = postId;
    this.postImageAddr = this.baseApiUrl + '/image?s3key=' + postImageAddr;

  }
}
