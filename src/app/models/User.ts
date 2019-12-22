import { environment } from '../../environments/environment';

export class User {
  id: number;
  username: string;
  fullName: string;
  profileImageAddr: string;
  description: string;
  email: string;
  hashedPassword: any;
  birthDate: any;
  private baseApiUrl = environment.BASE_API_URL;


  constructor(
    id: number,
    username: string,
    fullName: string,
    description: string,
    email: string,
    hashedPassword: any,
    birthDate: any,
    profileImageAddr: string
  ) {
    this.id = id;
    this.username = username;
    this.fullName = fullName;
    this.description = description;
    this.email = email;
    this.hashedPassword = hashedPassword,
      this.birthDate = birthDate,
      this.profileImageAddr = this.baseApiUrl + '/image?s3key=' + profileImageAddr
  }

}
