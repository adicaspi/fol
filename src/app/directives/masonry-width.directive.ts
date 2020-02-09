import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appMasonryWidth]'
})
export class MasonryWidthDirective implements OnInit {

  @Input()
  appMasonryWidth: number;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    //Change element width if device is mobile
    if (this.appMasonryWidth < 600) {
      this.setWidth(this.el.nativeElement);
    }
  }

  setWidth(element: HTMLElement) {

    var masonryItemWidth = ((this.appMasonryWidth - 24) - 12) / 2;
    element.style.width = masonryItemWidth + "px";

  }

}
