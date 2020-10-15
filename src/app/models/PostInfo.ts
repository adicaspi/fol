import { environment } from '../../environments/environment';

export class PostInfo {
  description: string;
  postId: number;
  postImageAddr: string;
  price: string;
  storeId: number;
  storeLogoAddr: string;
  storeName: string;
  thumbnailAddr: string;
  userId: number;
  userName: string;
  userProfileImageAddr: string;
  website: string;
  numViews: number;
  numLikes: number;
  private baseApiUrl = environment.BASE_API_URL;

  constructor(
    description: string,
    postId: number,
    postImageAddr: string,
    price: string,
    storeId: number,
    storeLogoAddr: string,
    storeName: string,
    thumbnailAddr: string,
    userId: number,
    userName: string,
    userProfileImageAddr: string,
    website: string,
    numViews: number,
    numLikes: number

  ) {
    this.description = description;
    this.postId = postId;
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
  }
}
