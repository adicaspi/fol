import {
    Directive, ElementRef, OnInit, 
    Input, HostListener
} from '@angular/core';

@Directive({
    selector: '[heightWidthRatio]',
})
export class HeightWidthRatioDirective implements OnInit {

    @Input()
    heightWidthRatio: number;

    constructor(private el: ElementRef) {
        
    }

    ngOnInit(): void {
        this.setHeight(this.el.nativeElement);
    }

    setHeight(element: HTMLElement) {
        var width = element.offsetWidth;
        var height = width * this.heightWidthRatio;
        element.style.height = height + "px";
    }

}