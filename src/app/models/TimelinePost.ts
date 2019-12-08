import { GlobalVariable } from '../../global';

export class TimelinePost {
  profileImgSrc: string;
  post: any;
  postImgSrc: string;
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

  get storeNameMobile(){
    var website = this.post.website;
    var str = website.substring(0, website.length - 4); //remove .com from store name
    return str; 
  }
}
