import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ErrorsService } from '../../services/errors.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-view-explore',
  templateUrl: './view-explore.component.html',
  styleUrls: ['./view-explore.component.css']
})
export class ViewExploreComponent implements OnInit {
  filteredOptions: Observable<string[]>;
  searchedTouched: Observable<boolean>;
  private subscription: Subscription;
  private anyErrors: boolean;
  private finished: boolean;
  desktop: Boolean = true;

  constructor(private errorService: ErrorsService, private configService: ConfigService) { }

  ngOnInit() {
    this.subscription = this.configService.windowSizeChanged.subscribe(
      value => {
        if (value.width <= 600) {
          this.desktop = false;
        }
        else {
          this.desktop = true;
        }
      }),
      error => this.anyErrors = true,
      () => this.finished = true

  }

}
