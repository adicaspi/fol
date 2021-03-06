import { environment } from '../../environments/environment';

export class TimelinePost {
  profileImgSrc: string;
  post: any;
  postImgSrc: string;
  thumbnail: string;
  selfThumb: string
  private baseApiUrl = environment.BASE_API_URL;

  constructor(
    post: any,
    postImgSrc: string,
    profileImgSrc: string,
    thumbnail?: string,
    selfThumb?: string
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

    if (post.selfThumb) {
      this.selfThumb = this.baseApiUrl + '/image?s3key=' + selfThumb;
    }
  }

  get storeNameMobile() {
    var website = this.post.website;
    if (website.includes(".com")) {
      var str = website.substring(0, website.length - 4); //remove .com from store name
    } else {
      var str = website.substring(0, website.length - 6); //remove .com from store name
    }
    return str;
  }

  get storeWebsite() {
    var websiteSuffix = this.post.website;
    var fullWebsite = 'https://www.' + websiteSuffix;
    return fullWebsite;
  }

  get selfThumbAddr() {
    return this.selfThumb;
  }
}
