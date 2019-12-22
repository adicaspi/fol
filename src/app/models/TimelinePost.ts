import { environment } from '../../environments/environment';

export class TimelinePost {
  profileImgSrc: string;
  post: any;
  postImgSrc: string;
  thumbnail: string;
  private baseApiUrl = environment.BASE_API_URL;

  constructor(
    post: any,
    postImgSrc: string,
    profileImgSrc: string,
    thumbnail?: string
  ) {
    this.post = post;
    this.postImgSrc = this.baseApiUrl + '/image?s3key=' + postImgSrc;
    this.profileImgSrc = this.baseApiUrl + '/image?s3key=' + profileImgSrc;
    if (thumbnail) {
      this.thumbnail = this.baseApiUrl + '/image?s3key=' + thumbnail;
    }
    else {
      this.thumbnail = null;
    }
  }

  get storeNameMobile() {
    var website = this.post.website;
    var str = website.substring(0, website.length - 4); //remove .com from store name
    return str; 
  }
}
