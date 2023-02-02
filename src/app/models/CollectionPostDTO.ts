import { environment } from '../../environments/environment';

export class CollectionPost {
  profileImgSrc: string;
  post: any;
  postImgSrc: string;
  thumbnail: string;
  selfThumb: string
  private baseApiUrl = environment.BASE_API_URL;

  constructor(
    postId: any,
    userId: any,
    postImageAddr: string,
    description: string,
    link: string,
    price: string,
    salePrice: string,
    website: string,
    thumbnail?: string,
    selfThumb?: string

  ) {

    this.postImgSrc = this.baseApiUrl + '/image?s3key=' + postImageAddr;
    if (thumbnail) {
      this.thumbnail = this.baseApiUrl + '/image?s3key=' + thumbnail;
    }
    else {
      this.thumbnail = null;
    }

    if (selfThumb) {
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
