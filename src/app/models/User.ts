import { GlobalVariable } from '../../global';

export class User {
  id: number;
  username: string;
  fullName: string;
  profileImageAddr: string;
  description: string;
  email: string;
  hashedPassword: any;
  birthDate: any;
  private baseApiUrl = GlobalVariable.BASE_API_URL;


  constructor(
    profileImageAddr: string
  ) { this.profileImageAddr = this.baseApiUrl + '/image?s3key=' + profileImageAddr }

}
