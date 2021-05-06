import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { Router } from '@angular/router';
import { Title, Meta } from '../../../../node_modules/@angular/platform-browser';

@Component({
  selector: 'app-view-explore-general',
  templateUrl: './view-explore-general.component.html',
  styleUrls: ['./view-explore-general.component.scss']
})
export class ViewExploreGeneralComponent implements OnInit {
  desktop: Boolean = true;
  error: any = {};
  ios: boolean = false;
  private subscription;
  private anyErrors: boolean;
  private finished: boolean;

  constructor(
    private configService: ConfigService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.subscription = this.configService.windowSizeChanged.subscribe(
      value => {
        if (value.width <= 600) {
          this.desktop = false;
          this.ios = this.configService.iOS();
        }
        else {
          this.desktop = true;
        }
      }),
      error => this.anyErrors = true,
      () => this.finished = true
  }

  landingPage() {
    this.router.navigate(['landing']);
  }

}
