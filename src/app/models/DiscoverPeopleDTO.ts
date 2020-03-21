import { environment } from '../../environments/environment';

const apiUrl = environment.BASE_API_URL;

export class DiscoverPeopleDTO {
  userId: number;
  userProfileImageAddr: string;
  username: string;
  fullName: string;
  numFollowers: number;
  follow: boolean = false;
  items = [];

  constructor(doc) {
    this.userId = doc.userId;
    this.userProfileImageAddr = doc.userProfileImageAddr;
    this.username = doc.username;
    this.fullName = doc.fullName;
    this.numFollowers = doc.numFollowers;
    doc.items.forEach(item => {
      let newItem = {
        postId: item.postId,
        imageAddr: (`${apiUrl}/image?s3key=${item.postImageAddr}`)
      }
      this.items.push(newItem);
    })
  }

  get userAvatar() {
    return `${apiUrl}/image?s3key=${this.userProfileImageAddr}`;
  }
}