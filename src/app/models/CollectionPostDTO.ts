import { environment } from '../../environments/environment';

export class CollectionPost {
  postId: any;
  userId: any;
  postImageAddr: string;
  description: string;
  link: string;
  price: string;
  salePrice: string;
  website: string;
  thumbnail?: string;
  selfThumb?: string;
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
    this.postId = postId;
    this.userId = userId;
    this.postImageAddr = this.baseApiUrl + '/image?s3key=' + postImageAddr;
    this.description = description;
    this.link = link;
    this.price = price;
    this.salePrice = salePrice;
    this.website = website.split('.')[0];
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
    var website = this.website;
    if (website.includes(".com")) {
      var str = website.substring(0, website.length - 4); //remove .com from store name
    } else {
      var str = website.substring(0, website.length - 6); //remove .com from store name
    }
    return str;
  }

  get storeWebsite() {
    var websiteSuffix = this.website;
    var fullWebsite = 'https://www.' + websiteSuffix;
    return fullWebsite;
  }

  get selfThumbAddr() {
    return this.selfThumb;
  }
}

export class CollectionInfo {
  collectionId: any;
  userId: any;
  collectionName: string;
  collectionImageAddr: string

  constructor(
    collectionId: any,
    userId: any,
    collectionName: string,
    collectionImageAddr: string,
    private baseApiUrl = environment.BASE_API_URL

  ) {
    this.collectionId = collectionId;
    this.userId = userId;
    this.collectionName = collectionName;
    this.collectionImageAddr = this.baseApiUrl + '/image?s3key=' + collectionImageAddr;
  }
}

