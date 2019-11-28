import { GlobalVariable } from '../../global';

export class TimelinePost {
  // postId: string;
  //userProfileImageAddr: string;
  profileImgSrc: string;
  post: any;
  // userName: string;
  postImgSrc: string;
  // description: string;
  // link: string;
  // website: string;
  // show: boolean = false;
  // userId: number;
  private baseApiUrl = GlobalVariable.BASE_API_URL;

  constructor(
    post: any,
    postImgSrc: string,
    profileImgSrc: string

  ) {
    this.post = post;
    this.postImgSrc = this.baseApiUrl + '/image?s3key=' + postImgSrc;
    this.profileImgSrc = this.baseApiUrl + '/image?s3key=' + profileImgSrc;

  }
}
