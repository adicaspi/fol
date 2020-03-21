import { Component, OnInit } from '@angular/core';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject, Subscription } from '../../../../node_modules/rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-view-discover-people-user',
  templateUrl: './view-discover-people-user.component.html',
  styleUrls: ['./view-discover-people-user.component.scss']
})
export class ViewDiscoverPeopleUserComponent implements OnInit {
  discoverPeopleArray = [];
  onDestroy: Subject<void> = new Subject<void>();

  constructor(private userService: UserService) { }


  ngOnInit() {
    this.userService.discoverPeopleUser().pipe(takeUntil(this.onDestroy)).subscribe(res => {
      this.discoverPeopleArray = res;
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
  }


}
