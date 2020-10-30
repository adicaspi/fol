import { Component, OnInit } from '@angular/core';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject, Subscription } from '../../../../node_modules/rxjs';
import { FeedService } from '../../services/feed.service';
import * as angular from 'angular';
import $ from 'jquery';
import { ConfigService } from '../../services/config.service';
(window as any).jQuery = $;


@Component({
  selector: 'app-external-website',
  templateUrl: './external-website.component.html',
  styleUrls: ['./external-website.component.scss']
})
export class ExternalWebsiteComponent implements OnInit {
  usersCarousel = [];
  usersCarouselTry = [];
  desktop: boolean;
  logoSrc: string;
  onDestroy: Subject<void> = new Subject<void>();
  discoverPeopleArray = [];
  private WindowSizeSubscription: Subscription;
  users = [{ username: "adi caspi", profileImg: "http://placehold.it/380?text=1", followers: "10", images: ["http://placehold.it/380?text=1", "http://placehold.it/380?text=2", "http://placehold.it/380?text=3"] }, { username: "tamir", profileImg: "http://placehold.it/380?text=1", followers: "12", images: ["http://placehold.it/380?text=4", "http://placehold.it/380?text=5", "http://placehold.it/380?text=6"] }, { username: "rani ophir", profileImg: "http://placehold.it/380?text=1", followers: "14", images: ["http://placehold.it/380?text=7", "http://placehold.it/380?text=8", "http://placehold.it/380?text=9"] }, { username: "eli ophir", profileImg: "http://placehold.it/380?text=1", followers: "156", images: ["http://placehold.it/380?text=7", "http://placehold.it/380?text=8", "http://placehold.it/380?text=9"] }, { username: "dan caspi", profileImg: "http://placehold.it/380?text=1", followers: "134", images: ["http://placehold.it/380?text=7", "http://placehold.it/380?text=8", "http://placehold.it/380?text=9"] }, { username: "nir zep", profileImg: "http://placehold.it/380?text=1", followers: "122", images: ["http://placehold.it/380?text=7", "http://placehold.it/380?text=8", "http://placehold.it/380?text=9"] }];

  constructor(private feedService: FeedService,
    private configService: ConfigService, ) { }

  ngOnInit() {
    //this.initCarousel();
    this.feedService.discoverPeopleGeneral().pipe(takeUntil(this.onDestroy)).subscribe(res => {
      this.discoverPeopleArray = res;
      this.generateCarousel();
    });

    //set slots top position
    this.initSlots();
    this.WindowSizeSubscription = this.configService.windowSizeChanged
      .subscribe(
        value => {
          if (value.width >= 600) {
            this.desktop = true;
            this.logoSrc = "../../../assets/landing-logo.png";
          }

          if (value.width <= 600) {
            this.desktop = false;
            this.logoSrc = "../../../assets/fw_logo_pink.png"
          }

        });
  }

  initSlots() {
    var slot2 = $(".card-wrapper:nth-child(2) .user-post img");
    var slot3 = $(".card-wrapper:nth-child(3)");
    var slot4 = $(".card-wrapper:nth-child(4)");
    var slot5 = $(".card-wrapper:nth-child(5)");

    console.log(slot2.outerHeight());

    // console.log(slots.join());
  }

  generateCarousel() {
    let i;
    let j;
    let newUsersArray;
    for (i = 0; i < this.discoverPeopleArray.length; i++) {
      newUsersArray = [];
      for (j = 0; j < this.discoverPeopleArray.length; j++) {
        newUsersArray.push(this.discoverPeopleArray[(j + i) % this.discoverPeopleArray.length]);
      }
      this.usersCarousel.push(newUsersArray);
    }
  }

  getItemsDesktop(items) {
    var desktopItems = []
    for (var i = 0; i < 3 && i < items.length; i++) {
      desktopItems.push(items[i]);
    }
    return desktopItems;
  }

  initCarousel() {

    $('#recipeCarousel').carousel({
      interval: 10000
    })

    $('.carousel .carousel-item').each(function () {
      console.log("here", $(this));

      var minPerSlide = 3;
      var next = ($(this)).next();
      if (!next.length) {
        next = ($(this)).siblings(':first');
      }
      next.children(':first-child').clone().appendTo($(this));

      for (var i = 0; i < minPerSlide; i++) {
        next = next.next();
        if (!next.length) {
          next = ($(this)).siblings(':first');
        }

        next.children(':first-child').clone().appendTo($(this));
      }
    });


  }


  initSlideShow(that) {
    $(document).ready(function () {
      $("#myCarousel").on("slide.bs.carousel", function (e) {
        var $e = $(e.relatedTarget);
        var idx = $e.index();
        var itemsPerSlide = 3;
        var totalItems = $(".carousel-item").length;

        if (idx >= totalItems - (itemsPerSlide - 1)) {
          var it = itemsPerSlide - (totalItems - idx);
          for (var i = 0; i < it; i++) {
            // append slides to end
            if (e.direction == "left") {
              $(".carousel-item")
                .eq(i)
                .appendTo(".carousel-inner");
            } else {
              $(".carousel-item")
                .eq(0)
                .appendTo($(this).find(".carousel-inner"));
            }
          }
        }
      });
    });

  }

  ngOnDestroy(): void {
    this.onDestroy.next();
  }

}
