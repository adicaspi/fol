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


  // constructor(
  //   id: number,
  //   username: string,
  //   fullName: string,
  //   description: string,
  //   email: string,
  //   hashedPassword: any,
  //   birthDate: any,
  //   profileImageAddr: string
  // ) {
  //   this.id = id;
  //   this.username = username;
  //   this.fullName = fullName;
  //   this.description = description;
  //   this.email = email;
  //   this.hashedPassword = hashedPassword,
  //     this.birthDate = birthDate,
  //     this.profileImageAddr = this.baseApiUrl + '/image?s3key=' + profileImageAddr
  // }

  constructor(
    doc
  ) {
    this.id = doc.id;
    this.username = doc.username;
    this.fullName = doc.fullName;
    this.description = doc.description;
    this.email = doc.email;
    this.hashedPassword = doc.hashedPassword,
      this.birthDate = doc.birthDate,
      this.profileImageAddr = this.baseApiUrl + '/image?s3key=' + doc.profileImageAddr
  }

}
