import { environment } from '../../environments/environment';

export class PostInfo {
  description: string;
  postId: number;
  userId: number;
  postImageAddr: string;
  price: string;
  salePrice: string;
  storeId: number;
  storeLogoAddr: string;
  storeName: string;
  thumbnailAddr: string;
  userName: string;
  userProfileImageAddr: string;
  website: string;
  numViews: number;
  numLikes: number;
  createDate: any;
  selfThumbAddr: string;
  link: string;
  private baseApiUrl = environment.BASE_API_URL;

  constructor(
    postId: number,
    userId: number,
    storeId: number,
    userProfileImageAddr: string,
    userName: string,
    postImageAddr: string,
    description: string,
    price: string,
    salePrice: string,
    storeLogoAddr: string,
    storeName: string,
    website: string,
    thumbnailAddr: string,
    selfThumbAddr: string,
    link: string,
    numViews: number,
    numLikes: number,
    createDate: any,
  ) {
    this.description = description;
    this.postId = postId;
    this.userId = userId;
    this.postImageAddr = this.baseApiUrl + '/image?s3key=' + postImageAddr;
    this.price = price;
    this.storeId = storeId;
    this.storeLogoAddr = this.baseApiUrl + '/image?s3key=' + storeLogoAddr;
    this.storeName = storeName;
    this.thumbnailAddr = this.baseApiUrl + '/image?s3key=' + thumbnailAddr;
    this.userId = userId;
    this.userName = userName;
    this.userProfileImageAddr = this.baseApiUrl + '/image?s3key=' + userProfileImageAddr;
    this.website = website;
    this.numViews = numViews;
    this.numLikes = numLikes;
    this.createDate = createDate;
    this.selfThumbAddr = this.baseApiUrl + '/image?s3key=' + selfThumbAddr;
    this.link = link;
    this.salePrice = salePrice;
  }
}
