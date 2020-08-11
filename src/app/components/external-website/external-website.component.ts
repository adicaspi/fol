import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-external-website',
  templateUrl: './external-website.component.html',
  styleUrls: ['./external-website.component.scss']
})
export class ExternalWebsiteComponent implements OnInit {
  users = [];
  constructor() { }

  ngOnInit() {
    this.initCarousel(this);
    this.users = [{ username: "adi", followers: "8" }, { username: "adi", followers: "8" }, { username: "adi", followers: "8" }, { username: "adi", followers: "8" }, { username: "adi", followers: "8" }, { username: "adi", followers: "8" }];
  }

  initCarousel(that) {

    $('#recipeCarousel').carousel({
      interval: 10000
    })

    $('.carousel .carousel-item').each(function () {
      var minPerSlide = 3;
      var next = (that).next();
      if (!next.length) {
        next = (that).siblings(':first');
      }
      next.children(':first-child').clone().appendTo((that));

      for (var i = 0; i < minPerSlide; i++) {
        next = next.next();
        if (!next.length) {
          next = (that).siblings(':first');
        }

        next.children(':first-child').clone().appendTo((that));
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

}
