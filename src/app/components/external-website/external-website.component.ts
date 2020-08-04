import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
(window as any).jQuery = $;

@Component({
  selector: 'app-external-website',
  templateUrl: './external-website.component.html',
  styleUrls: ['./external-website.component.scss']
})
export class ExternalWebsiteComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.initCarousel(this);
  }

  initCarousel(that) {

    $('#recipeCarousel').carousel({
      interval: 10000
    })

    $('.carousel .carousel-item').each(function () {
      var minPerSlide = 3;
      var next = $(this).next();
      if (!next.length) {
        next = $(this).siblings(':first');
      }
      next.children(':first-child').clone().appendTo($(this));

      for (var i = 0; i < minPerSlide; i++) {
        next = next.next();
        if (!next.length) {
          next = $(this).siblings(':first');
        }

        next.children(':first-child').clone().appendTo($(this));
      }
    });


  }

}
