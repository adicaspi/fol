import { GlobalVariable } from '../../global';

const apiUrl = GlobalVariable.BASE_API_URL;

export class SearchItem {
  id: number;
  username: string;
  fullName: string;
  userProfileImageAddr: string;

  constructor(doc) {
    this.id = doc.id || 0;
    this.username = doc.username || '';
    this.fullName = doc.fullName || '';
    this.userProfileImageAddr = doc.userProfileImageAddr || '';
  }

  get userAvatar() {
    return `${apiUrl}/image?s3key=${this.userProfileImageAddr}`;
  }
}
