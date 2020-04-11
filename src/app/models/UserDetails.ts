import { environment } from '../../environments/environment';

export class UserDetails {
  id: number;
  username: string;
  fullName: string;
  profileImageAddr: string;
  description: string;
  email: string;
  //hashedPassword: any;
  birthDate: any;
  private baseApiUrl = environment.BASE_API_URL;

  constructor(
    doc
  ) {
    this.id = doc.id;
    this.username = doc.username;
    this.fullName = doc.fullName;
    this.description = doc.description;
    this.email = doc.email;
    //this.hashedPassword = doc.hashedPassword,
    this.birthDate = doc.birthDate,
      this.profileImageAddr = this.baseApiUrl + '/image?s3key=' + doc.profileImageAddr
  }

}
