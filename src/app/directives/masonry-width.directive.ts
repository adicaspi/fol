import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appMasonryWidth]'
})
export class MasonryWidthDirective implements OnInit {

  @Input()
  appMasonryWidth: number;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.setWidth(this.el.nativeElement);
  }

  setWidth(element: HTMLElement) {
    console.log("im window width", this.appMasonryWidth);
    var masonryItemWidth = ((this.appMasonryWidth - 24) - 12) / 2;
    element.style.width = masonryItemWidth + "px";

  }

}
