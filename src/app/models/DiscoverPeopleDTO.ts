import { environment } from '../../environments/environment';

const apiUrl = environment.BASE_API_URL;

export class DiscoverPeopleDTO {
  userId: number;
  userProﬁleImageAddr: string;
  username: string;
  fullName: string;
  numFollowers: number;
  items = [];

  constructor(doc) {
    this.userId = doc.userId;
    this.userProﬁleImageAddr = doc.userProﬁleImageAddr;
    this.username = doc.username;
    this.fullName = doc.fullName;
    this.numFollowers = doc.numFollowers;
    this.items = doc.items;
  }

  get userAvatar() {
    return `${apiUrl}/image?s3key=${this.userProﬁleImageAddr}`;
  }
}