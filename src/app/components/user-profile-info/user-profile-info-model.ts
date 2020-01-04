import { Observable, Subject, Subscription } from 'rxjs';
import { User } from '../../models/User';
import { MatDialogRef } from '@angular/material';

export class UserProfileInfoModel {
  currMasterId: number;
  slaveId: number;
  follows: boolean;
  user: Observable<User>;
  userId: number;
  userProfileImageSrc: string;
  src: any;
  following: Observable<number>;
  followers: Observable<number>;
  numberOfPosts: Observable<number>;
  userLoaded: Promise<boolean>;
  flag: number = 1;
  clicked: boolean = false;
  onDestroy: Subject<void> = new Subject<void>();
  desktop: boolean = false;
  userProfile: boolean = false;
  private subscription: Subscription;
  private msgSubscription: Subscription;
  private anyErrors: boolean;
  private finished: boolean;
  followingDialogRef: MatDialogRef<{}, any>;


}